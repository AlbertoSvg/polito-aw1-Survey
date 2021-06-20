import { Col, Container, Row, Button, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { Redirect, useLocation } from "react-router-dom";

function CompileSurvey(props) {
    const location = useLocation();
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [survey, setSurvey] = useState(location.state ? location.state.survey : {});
    const [answers, setAnswers] = useState([]);
    const [name, setName] = useState('');

    const handleName = (value) => {
        if (value) {
            setName(value);
        }
        else {
            setName('');
        }
    }

    const handleSubmit = (event) => {

        event.preventDefault();
        //const err = checkValidation();
        //console.log(err);
        /*if (err.nameErr) {
            setMessage('Please insert a name');
        } else if (err.titleError || err.qErr.filter(e => e.qTitle === true).length !== 0 || err.qErr.filter(e => e.cId ? e.cId.length !== 0 : false).length !== 0) {
            console.log(err.qErr.filter(e => e.qTitle === true).length !== 0);

            console.log(err.qErr.filter(e => e.cId.length !== 0));
            setMessage('Check errors before submit');
        } else {
            const quest = questions.map((q) => { return { title: q.title, type: q.type, min: q.min, max: q.max, choices: q.choices ? [...q.choices] : [] } });
            const survey = { title: title, questions: quest };
            props.addSurvey(survey);
            setSubmitted(true);
            setErrors({});
        }*/

         const ans = answers.map(a => {return {idQ: a.idQ, data: a.data.toString()}});
         const response = {idS: survey.id, name: name, answers: ans};
         props.sendSurveyAnswers(response);
         setSubmitted(true);
         //setErrors({});

    }

    console.log("survey");
    console.log(survey);

    console.log('name');
    console.log(name);

    console.log("answers");
    console.log(answers);

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
                            <Row>
                                <Col sm={11}>
                                    <div className="questionBorder">
                                        <Form.Group controlId="name">
                                            <h3 className="text-left">Your name: <span className="text-danger">*</span></h3>
                                            <Form.Control required size="lg" type="text" placeholder="Enter your name" value={name} onChange={(ev) => handleName(ev.target.value)} />
                                        </Form.Group>
                                    </div>
                                </Col>
                            </Row>
                            {survey.questions.map((q, i) => <>
                                <Form.Row key={`row-${i}`} className="mt-3" />
                                <Question key={`quest-${i}`} setAnswers={setAnswers} answers={answers} question={q}></Question>
                            </>
                            )}
                        </Form>
                    </Col>
                    <Col sm={3} className="formBackground"></Col>

                </Row>

                <Button type="button" className="btn btn-lg btn-primary submitButton" onClick={handleSubmit}>
                    Send
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
                        <h3 className="text-left questionTitle">{props.question.title}<span className="text-danger">{props.question.min ? ' *' : ''}</span></h3>
                        {props.question.type === 1 && props.question.max > 1 ? <p>( You can answer a maximum of {props.question.max} options )</p> : ''}
                    </Col>
                </Form.Group>
                {props.question.type === 1 ? props.question.choices.map((c, i) => <MultipleChoiceRow key={`choice-${c.id}`} answers={props.answers} setAnswers={props.setAnswers} questionId={props.question.id} min={props.question.min} max={props.question.max} choice={c}></MultipleChoiceRow>) : <OpenQuestionResponse answers={props.answers} setAnswers={props.setAnswers} questionId={props.question.id}></OpenQuestionResponse>}
            </div>
        </Col>
    </Row>
}

function OpenQuestionResponse(props) {

    const handleOpenAnswer = (value) => {
        if (value) {
            if (props.answers.length === 0 || props.answers.filter(a => a.idQ === props.questionId).length === 0) {
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
            if (props.answers.length === 0 || props.answers.filter(a => a.idQ === props.questionId).length === 0) {
                console.log("1")
                const answer = { idQ: props.questionId, data: [choice.id] };
                props.setAnswers((old) => {
                    return [...old, answer];
                })
            } else {

                if (props.max === 1) {
                    console.log("2");
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
                    console.log("3");
                    props.setAnswers((old) => {
                        return old.map(oldA => {
                            const oldData = oldA.data;
                            if (oldA.idQ === props.questionId) {
                                const newData = oldData;
                                if (oldData.length < props.max)
                                    newData.push(choice.id);

                                return { ...oldA, data: newData };
                            } else {
                                return oldA;
                            }
                        });
                    })
                }

            }
        } else {
            console.log("4");
            props.setAnswers((old) => {
                const newAnswers = old.map(oldA => {
                    if (oldA.idQ === props.questionId) {
                        const index = oldA.data.findIndex((d) => d === choice.id);
                        console.log("index: " + index);
                        if (index !== -1) {
                            const data = oldA.data;
                            data.splice(index, 1);
                            return { ...oldA, data: data };
                        }
                        return oldA;
                    } else {
                        return oldA;
                    }
                })
                return newAnswers.filter(answer => answer.data.length !== 0);
            })
        }
    }

    const handleDisabled = () => {
        const answer = props.answers.find(a => a.idQ === props.questionId);
        if (props.max !== 1 && answer) {
            if (!answer.data.includes(choice.id) && answer.data.length === props.max)
                return true;
            else return false;

        } else return false;
    }

    return (
        <Form.Row className="mt-3">
            <Col sm={6}>
                <Form.Check
                    custom
                    type={props.max === 1 ? "radio" : "checkbox"}
                    id={`custom-${choice.id}`}
                    label={choice.choiceTitle}
                    disabled={handleDisabled()}
                    checked={props.answers.filter(a => a.data.includes(choice.id)).length !== 0 ? true : false}
                    onChange={(ev) => handleMultipleChoice(ev.target.checked)}
                />
            </Col>
        </Form.Row>
    );
};




export default CompileSurvey;