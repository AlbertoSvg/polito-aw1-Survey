import { Col, Container, Row, Button, Form, InputGroup, Alert } from "react-bootstrap";
import { ChevronUp, ChevronDown, PlusCircle, PlusLg, XLg, XCircle } from "react-bootstrap-icons";
import { useState } from "react";
import { Redirect, useLocation } from "react-router-dom";

function CompileSurvey(props) {
    const location = useLocation();
    const [submitted, setSubmitted] = useState(false);
    const [survey, setSurvey] = useState(location.state ? location.state.survey : {});
    const [answers, setAnswers] = useState([]);
    console.log("survey");
    console.log(survey);

    console.log("answers");
    console.log(answers);



    const removeAnswer = () => {

    }

    return <>
        {survey && Object.keys(survey).length === 0 && survey.constructor === Object ?
            <Redirect to="/surveys"></Redirect> :
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
                                            <p className="text-danger">* Campo obbligatorio</p>
                                        </Form.Group>
                                    </div>
                                </Col>
                            </Row>
                            {survey.questions.map((q, i) => <>
                                <Form.Row className="mt-3" />
                                <Question key={`quest${q.id}`} setAnswers={setAnswers} answers={answers} question={q}></Question>
                            </>
                            )}
                        </Form>
                    </Col>
                    <Col sm={3} className="formBackground"></Col>

                </Row>

                <Button type="button" className="btn btn-lg btn-primary submitButton" onClick={() => {/*handleSubmit*/ }}>
                    Submit
                </Button>
                {submitted ? <Redirect to="/surveys"></Redirect> : ''}
            </Container>}
    </>
};

function Question(props) {
    return <Row>
        <Col sm={11}>
            <div className="questionBorder">
                <Form.Group as={Row} controlId="formQuestion">
                    <Col sm={12}>
                        <h3 className="text-left questionTitle">{props.question.title}</h3>
                    </Col>
                </Form.Group>
                {props.question.type === 1 ? props.question.choices.map((c, i) => <MultipleChoiceRow key={`choice${props.question.id}${c.id}`} answers={props.answers} setAnswers={props.setAnswers} questionId={props.question.id} min={props.question.min} max={props.question.max} choice={c}></MultipleChoiceRow>) : <OpenQuestionResponse answers={props.answers} setAnswers={props.setAnswers} questionId={props.question.id}></OpenQuestionResponse>}
            </div>
        </Col>
    </Row>
}

function OpenQuestionResponse(props) {
    const handleOpenAnswer = (value) => {
        if (value) {
            if (props.answers.length === 0 || props.answers.filter(a => a.idQ === props.questionId) === 0) {
                const answer = { idQ: props.questionId, data: value };
                props.setAnswers((old) => {
                    return [...old, answer];
                })
            } else {
                props.setAnswers((old) => {
                    return old.map(oldA => {
                        if (oldA.idQ === props.questionId) {
                            return { ...oldA, data: value };
                        } else {
                            return oldA;
                        }
                    });
                })
            }
        } else {
            props.setAnswers(old => {
                const index = old.findIndex((a) => a.idQ === props.questionId);
                if (index !== -1) {
                    const newAnswers = [...old];
                    newAnswers.splice(index, 1);
                    return newAnswers;
                }
                return [...old]
            })

        }
    }

    return <Form.Control as="textarea" placeholder="Write your response here" onChange={(ev) => handleOpenAnswer(ev.target.value)}></Form.Control>
}


function MultipleChoiceRow(props) {
    const choice = props.choice;

    const handleMultipleChoice = (value) => {
        if (value) {
            if (props.answers.length === 0 || props.answers.filter(a => a.idQ === props.questionId) === 0) {
                const answer = { idQ: props.questionId, data: [choice.id] };
                props.setAnswers((old) => {
                    return [...old, answer];
                })
            } else {
                if (props.max === 1) {
                        props.setAnswers((old) => {
                            return old.map(oldA => {
                                if (oldA.idQ === props.questionId) {
                                    return { ...oldA, data: [choice.id] };
                                } else {
                                    return oldA;
                                }
                            });
                        })
                }
                else {
                    props.setAnswers((old) => {
                        return old.map(oldA => {
                            const oldData = oldA.data;
                            if (oldA.idQ === props.questionId) {
                                const newData = oldData.push(choice.id);
                                return { ...oldA, data: newData };
                            } else {
                                return oldA;
                            }
                        });
                    })
                }

            }
        } else {

        }
    }

    return (
        <Form.Row className="mt-3">
            <Col sm={6}>
                <Form.Check
                    custom
                    type={props.max === 1 ? "radio" : "checkbox"}
                    id={`custom-${choice.id}`}
                    label={choice.choiceTitle}
                    checked={props.answers.filter(a => a.data.includes(choice.id)).length !==0 ? true : false}
                    onChange={(ev) => handleMultipleChoice(ev.target.checked)}
                />
            </Col>
        </Form.Row>
    );
};




export default CompileSurvey;