import { Col, Container, Row, Button, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { Redirect, useLocation, NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

function AnswersPage(props) {
    const location = useLocation();
    const [answers, setAnswers] = useState(location.state ? location.state.answers : []);
    const [survey, setSurvey] = useState(location.state ? location.state.survey : {});
    const [answerIndex, setAnswerIndex] = useState(answers ? answers.length ? 0 : -1 : -1);
    console.log("survey");
    console.log(survey);
    console.log("answers");
    console.log(answers);
    console.log(answerIndex);

    const handleLeft = () => {
        if(answerIndex>0)
            setAnswerIndex((old) => old-1);
    }

    const handleRight = () => {
        if(answerIndex<answers.length-1)
            setAnswerIndex((old) => old+1);

    }

    return <>
        {(answers && Object.keys(answers).length === 0 && answers.constructor === Object) || (survey && Object.keys(survey).length === 0 && survey.constructor === Object) ?
            <Redirect to="/admin/surveys"></Redirect> :
            <Container fluid>
                <Row className="justify-content-center vheight-100 below-nav">
                    <Col sm={3}></Col>
                    <Col sm={6}>
                        <Form>
                            <Row>
                                <Col sm={11}>
                                    <div className="questionBorder">
                                        <Form.Group controlId="formTitle">
                                            <h3 className="display-4 text-left">{survey.title}</h3>
                                        </Form.Group>
                                    </div>
                                </Col>
                            </Row>
                            <Button className="leftButton" size="lg" variant="outline-primary" onClick={handleLeft}><ChevronLeft/></Button>
                            <Button className="rightButton" size="lg" variant="outline-primary" onClick={handleRight}><ChevronRight /></Button>
                            <NavLink to="/admin/surveys"><Button className="backButton" size="lg" variant="outline-primary" onClick={() => props.setDirty(true)}><ChevronLeft /> Back</Button></NavLink>
                            <Row>
                                <Col sm={11}>
                                <h4 className="text-center text-primary">{answerIndex+1}/{answers.length}</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={11}>
                                    <div className="questionBorder">
                                        <Form.Group controlId="name">
                                            <h3 className="text-left">Name: <span className="text-danger">*</span></h3>
                                            <Form.Control readOnly size="lg" type="text" value={answers[answerIndex].name} />
                                        </Form.Group>
                                    </div>
                                </Col>
                            </Row>
                            {survey.questions.map((q, i) => <>
                                <Form.Row key={`row-${i}`} className="mt-3" />
                                <Question key={`quest-${i}`} answer={answers[answerIndex].dataAnswers.find(da => da.idQ === q.id)} question={q}></Question>
                            </>
                            )}
                        </Form>
                    </Col>
                    <Col sm={3} className="formBackground"></Col>

                </Row>
            </Container>}
    </>
}


function Question(props) {
    const answer = props.answer ? props.answer : {};

    return <Row>
        <Col sm={11}>
            <div className="questionBorder">
                <Form.Group as={Row} controlId="formQuestion">
                    <Col sm={12}>
                        <h3 className="text-left questionTitle">{props.question.title}<span className="text-danger">{props.question.min ? ' *' : ''}</span></h3>
                    </Col>
                </Form.Group>
                {props.question.type === 1 ?
                    props.question.choices.map((c, i) => <MultipleChoiceRow key={`choice-${c.id}`} answer={props.answer} choice={c} max={props.question.max}></MultipleChoiceRow>)
                    :
                    <OpenQuestionResponse answer={props.answer}></OpenQuestionResponse>}
            </div>
        </Col>
    </Row>
}


function OpenQuestionResponse(props) {

    return <Form.Control readOnly as="textarea" value={props.answer ? props.answer.data : ''}></Form.Control>
}


function MultipleChoiceRow(props) {
    const choice = props.choice;

    return (
        <Form.Row className="mt-3">
            <Col sm={6}>
                <Form.Check
                    readOnly
                    custom
                    type={props.max === 1 ? "radio" : "checkbox"}
                    id={`custom-${choice.id}`}
                    label={choice.choiceTitle}
                    checked={props.answer ? props.answer.data.includes(choice.id) : false}
                />
            </Col>
        </Form.Row>
    );
};


export default AnswersPage;