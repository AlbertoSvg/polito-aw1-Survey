import { Col, Container, Row, Button, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { Redirect, useLocation, NavLink} from "react-router-dom";
import { ChevronLeft, Arrow90degRight} from "react-bootstrap-icons";

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

    const checkValidation = () => {
        const mandatoryQuestions = survey.questions.filter(q => q.min !== 0);
        const answersErrors = mandatoryQuestions.map((q) => answers.filter(a => a.idQ === q.id).length ? { idQ: q.id, error: false } : { idQ: q.id, error: true });
        const openAnswersMaxCharErr = survey.questions.map(q => q.type === 0 ? answers.filter(a => a.idQ === q.id && a.data.length <= 200).length ? { idQ: q.id, error: false } : { idQ: q.id, error: true } : { idQ: q.id, error: false });
        const nameError = name ? false : true;
        const errs = { nameError: nameError, answersErrors: answersErrors, openAnswersMaxCharErr: openAnswersMaxCharErr };
        setErrors(errs);
        return errs;
    }

    const handleSubmit = (event) => {

        event.preventDefault();
        const errs = checkValidation();
        if (errs.nameError || errs.answersErrors.filter(e => e.error === true).length || errs.openAnswersMaxCharErr.filter(e => e.error === true).length) {
            setMessage('Please, check the errors before submit');
        } else {
            const ans = answers.map(a => { return { idQ: a.idQ, data: a.data.toString() } });
            const response = { idS: survey.id, name: name, answers: ans };
            props.sendSurveyAnswers(response);
            setSubmitted(true);
            setErrors({});
        }
    }

    return <>
        {survey && Object.keys(survey).length === 0 && survey.constructor === Object ?
            <Redirect to="/surveys"></Redirect> :
            <Container fluid>
                <Row className="justify-content-center vheight-100 below-nav">
                    <Col sm={3}></Col>
                    <Col sm={6}>
                        {message && <Alert className="justify-content-center" variant="danger" onClose={() => setMessage('')} dismissible>{message}</Alert>}
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
                                    {errors ? errors.nameError ? <small className="text-danger">Please insert a name</small> : <></> : <></>}
                                    <div className={errors ? errors.nameError ? "questionBorderError" : "questionBorder" : "questionBorder"}>
                                        <Form.Group controlId="name">
                                            <h3 className="text-left">Your name: <span className="text-danger">*</span></h3>
                                            <Form.Control required size="lg" type="text" placeholder="Enter your name" value={name} onChange={(ev) => handleName(ev.target.value)} />
                                        </Form.Group>
                                    </div>
                                </Col>
                            </Row>
                            {survey.questions.map((q, i) => <>
                                <Form.Row key={`row-${i}`} className="mt-3" />
                                <Question key={`quest-${i}`} errors={errors} setAnswers={setAnswers} answers={answers} question={q}></Question>
                            </>
                            )}
                        </Form>
                    </Col>
                    <Col sm={3} className="formBackground"></Col>

                </Row>

                <Button type="button" className="submitButton" size="lg" variant="outline-primary" onClick={handleSubmit}>Send <Arrow90degRight/></Button>
                <NavLink to="/surveys"><Button className="leftButton" size="lg" variant="outline-primary" onClick={() => props.setDirty(true)}><ChevronLeft /> Back</Button></NavLink>
                {submitted ? <Redirect to="/surveys"></Redirect> : ''}
            </Container>}
    </>
};

function Question(props) {

    const checkErrorCondition = (type) => {
        let err = { mandatory: false, maxChars: false };
        if (props.errors) {
            if (!type && props.errors.openAnswersMaxCharErr)
                err = { ...err, maxChars: props.errors.openAnswersMaxCharErr.filter(e => e.idQ === props.question.id && e.error).length };
            else
                err = { ...err, maxChars: false };

            if (props.errors.answersErrors)
                err = { ...err, mandatory: props.errors.answersErrors.filter(e => e.idQ === props.question.id && e.error).length };
            else
                err = { ...err, mandatory: false };
        }
        else {
            err = { ...err, mandatory: false };
        }

        return err;
    }

    return <Row>
        <Col sm={11}>
            {checkErrorCondition(props.question.type).mandatory ?
                <small className="text-danger">This question is mandatory</small> :
                checkErrorCondition(props.question.type).maxChars ?
                    <small className="text-danger">Too many characters (max: 200)</small> : <></>}

            <div className={checkErrorCondition().mandatory || checkErrorCondition().maxChars ? "questionBorderError" : "questionBorder"}>
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

    return <Form.Control as="textarea" placeholder="Max 200 characters..." onChange={(ev) => handleOpenAnswer(ev.target.value)}></Form.Control>
}


function MultipleChoiceRow(props) {
    const choice = props.choice;

    const handleMultipleChoice = (value) => {
        if (value) {
            if (props.answers.length === 0 || props.answers.filter(a => a.idQ === props.questionId).length === 0) {
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