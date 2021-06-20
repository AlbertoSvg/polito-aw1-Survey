import { Col, Container, Row, Button, Form, InputGroup, Alert } from "react-bootstrap";
import { ChevronUp, ChevronDown, PlusCircle, PlusLg, XLg, XCircle } from "react-bootstrap-icons";
import { useState } from "react";
import { Redirect } from "react-router-dom";


function Questionary(props) {
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    console.log(questions);

    const handleTitle = (event) => {
        const value = event.target.value;

        if (value) {
            setTitle(value);
        }
        else {
            setTitle('');
        }
    }

    const deleteQuestion = (id) => {
        setQuestions((oldQ) => {
            const old = [...oldQ];
            old.splice(oldQ.findIndex(q => q.id === id), 1);
            return old.map((q, i) => { return { ...q, id: i + 1 } });
        });
    }

    function arraymove(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
    }

    const moveUp = (qIndex) => {
        console.log("moveUp");
        if (qIndex > 0) {
            const arr = arraymove([...questions], qIndex, qIndex - 1);
            arr[qIndex].id = qIndex + 1;
            arr[qIndex - 1].id = qIndex;
            setQuestions(arr);
        }
    }
    const moveDown = (qIndex) => {
        console.log("MoveDown");
        if (qIndex < questions.length - 1) {
            const arr = arraymove([...questions], qIndex, qIndex + 1);
            arr[qIndex].id = qIndex + 1;
            arr[qIndex + 1].id = qIndex + 2;
            setQuestions(arr);
        }
    }

    const checkValidation = () => {
        const titleError = title ? false : true;
        const noQuest = questions.length===0 ? true : false  
        const qErrors = questions.length!==0 ? questions.map((q) => {
            const qTitle = q.title ? false : true
            console.log(qTitle);
            const cId = q.choices ? q.choices.filter((c) => c.choiceTitle==='').map((c) => c.id) : [];
            return { qTitle: qTitle, cId: cId };
        }): [];
        const err = { qErr:[...qErrors], titleError: titleError, noQuestion: noQuest};
        console.log(err);
        setErrors(err);
        return err;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const err = checkValidation();
        console.log(err);
        if(err.titleError) {
            setMessage('Please insert a title');
        } else if(err.noQuestion){
            setMessage('Please add at least a question');
        } else if (err.titleError || err.qErr.filter(e => e.qTitle===true).length!==0 || err.qErr.filter(e => e.cId ? e.cId.length!==0 : false).length!==0) {
            console.log(err.qErr.filter(e => e.qTitle===true).length!==0 );

            console.log(err.qErr.filter(e => e.cId.length!== 0));
            setMessage('Check errors before submit');
        } else {
            const quest = questions.map((q) => { return { title: q.title, type: q.type, min: q.min, max: q.max, choices: q.choices ? [...q.choices] : [] } });
            const survey = { title: title, questions: quest };
            props.addSurvey(survey);
            setSubmitted(true);
            setErrors({});
        }
    }

    return <Container fluid>
        <Row className="justify-content-center below-nav">
        <h1>Prepare a new Survey</h1>
        </Row>
        <Row className="justify-content-center vheight-100 below-nav">
            <Col sm={3}></Col>
            <Col sm={6} className="formBorder">
                {message && <Alert className="justify-content-center" variant="danger" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                <Form>
                    <Row>
                        <Col sm={11}>
                            <Form.Group controlId="formTitle">
                                <Form.Control required size="lg" type="text" isInvalid={errors.titleError ? true : false} placeholder="Enter Title" value={title} onChange={(ev) => handleTitle(ev)} />
                                <Form.Control.Feedback type="invalid">Please enter a title</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        {questions.length === 0 ?
                            <Col sm={1}>
                                <Button type="button" size="sm" className="btn-primary mt-1 addButton" onClick={() => setQuestions((old) => [...old, { id: old.length + 1, type: 0, min: 1, max: 1 }])}><PlusLg></PlusLg></Button>
                            </Col> : ''}
                    </Row>
                    {questions.map((q, i) => <>
                        <Form.Row key={`formRow-${q.id}`} className="mt-3">
                            <Col sm={1}>
                                <Button type="button" size="sm" className="mt-1 btn-danger outline-light" onClick={() => deleteQuestion(q.id)}><XLg /></Button>
                            </Col>
                            <Col sm={3} className="mb-3">
                                <h3 className="mb-3">{`Question #${q.id}`}</h3>
                            </Col>
                            <Col>
                                <Row>
                                    <Col sm={1}>
                                        <Button className="mt-1" size="sm" variant="outline-success" onClick={() => { moveUp(i) }}> <ChevronUp /> </Button>
                                    </Col>
                                    <Col sm={1}>
                                        <Button className="mt-1" size="sm" variant="outline-success" onClick={() => { moveDown(i) }}> <ChevronDown /> </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Form.Row>
                        <Question key={`quest-${q.id}`} errors={errors ? errors.qErr ? errors.qErr[i] ? errors.qErr[i] : {} : {} : {}} setQuestions={setQuestions} nQuestions={questions.length} question={q}></Question>
                    </>
                    )}
                </Form>
            </Col>
            <Col sm={3} className="formBackground"></Col>

        </Row>

        <Button type="button" className="btn btn-lg btn-primary submitButton" onClick={handleSubmit}>
            Submit
        </Button>
        {submitted ? <Redirect to="/admin/surveys"></Redirect> : ''}
    </Container>
};


function Question(props) {
    //0 = text, 1 = multiple choice
    const questionChoices = props.question.choices ? props.question.choices : [];
    const [questionTitle, setQuestionTitle] = useState(props.question.title ? props.question.title : '');

    const handleQuestionTitle = (event) => {
        const value = event.target.value;

        if (value) {
            setQuestionTitle(value);
            props.setQuestions((oldQuestions) => {
                return oldQuestions.map((q) => {
                    if (q.id === props.question.id)
                        return {
                            ...q, title: value
                        };
                    else return q;
                })
            });
        }
        else {
            setQuestionTitle('');
            props.setQuestions((oldQuestions) => {
                return oldQuestions.map((q) => {
                    if (q.id === props.question.id)
                        return {
                            ...q, title: ''
                        };
                    else return q;
                })
            });
        }
    }

    const handleQuestionType = (event) => {
        const value = event.target.value === "Text" ? 0 : 1;
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map((q) => {
                if (q.id === props.question.id) {
                    if (value === 0) {
                        return {
                            ...q,
                            type: value,
                            choices: []
                        };
                    } else {
                        return {
                            ...q,
                            type: value,
                            choices: [{ id: 1, choiceTitle: '' }]
                        };
                    }
                }
                else { return q; }
            })
        });

    }

    const handleChoice = (event, id) => {
        const value = event.target.value;
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map((q) => {
                if (q.id === props.question.id)
                    return {
                        ...q,
                        choices: q.choices.map((c) => {
                            if (c.id === id)
                                return {
                                    ...c,
                                    choiceTitle: value
                                };
                            else
                                return c;
                        })
                    };
                else return q;
            })
        });

    }

    const addChoice = () => {
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map((q) => {
                if (q.id === props.question.id) {
                    const ch = q.choices;
                    return {
                        ...q,
                        choices: [...ch, { id: ch.length + 1, choiceTitle: '' }]
                    };
                }
                else { return q; }
            })
        });
    }

    const deleteChoice = (id) => {
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map(q => {
                if (q.id === props.question.id) {
                    const oldChoices = [...q.choices];
                    oldChoices.splice(q.choices.findIndex(c => c.id === id), 1);
                    const newChoices = oldChoices.map((c, i) => { return { ...c, id: i + 1 } });
                    return {
                        ...q,
                        choices: newChoices
                    }
                }
                else return q;
            })
        });
    }

    const handleMax = (event) => {
        const value = event.target.value;
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map((q) => {
                if (q.id === props.question.id)
                    return {
                        ...q,
                        max: parseInt(value)
                    };
                else return q;
            })
        });
    }

    const handleMin = (event) => {
        const value = event.target.checked;
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map((q) => {
                if (q.id === props.question.id)
                    return {
                        ...q,
                        min: !value ? 1 : 0
                    };
                else return q;
            })
        });
    }


    console.log(props.question);
    return <Row>
        <Col sm={11}>
            <div className="questionBorder">
                <Form.Group as={Row} controlId="formQuestion">
                    <Col sm={7}>
                        <Form.Control size="md" type="text" placeholder="Question" isInvalid={props.errors ? props.errors.qTitle ? true : false : false} value={questionTitle} onChange={(ev) => handleQuestionTitle(ev)} />
                        <Form.Control.Feedback type="invalid">Please enter a question title</Form.Control.Feedback>
                    </Col>
                    <Col sm={3}>
                        <Form.Control as="select" value={props.question.type ? "Multiple choice" : "Text"} onChange={(ev) => handleQuestionType(ev)}>
                            <option>Text</option>
                            <option>Multiple choice</option>
                        </Form.Control>
                    </Col>
                    <Col sm={2}>
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id={`customSwitch${props.question.id}`} onChange={(ev) => handleMin(ev)} />
                            <label className="custom-control-label" htmlFor={`customSwitch${props.question.id}`}>Optional</label>
                        </div>
                    </Col>
                </Form.Group>
                {props.question.type === 1 ? props.question.choices.map((c) => <MultipleChoiceRow key={`choice-${props.question.id}-${c.id}`} errors={props.errors ? props.errors.cId : ''} deleteChoice={deleteChoice} nChoices={questionChoices.length} choice={c} addChoice={addChoice} handleChoice={handleChoice} handleMax={handleMax}></MultipleChoiceRow>) : <></>}
            </div>
        </Col>
        {props.question.id === props.nQuestions ?
            <Col sm={1}>
                <Button type="button" size="sm" className="btn-primary mt-1 addButton" onClick={() => { props.setQuestions((old) => [...old, { id: old.length + 1, type: 0, min: 1, max: 1 }]) }}><PlusLg></PlusLg></Button>
            </Col> : <></>}
    </Row>
};

function MultipleChoiceRow(props) {
    const choice = props.choice;
    console.log("CHoice" + choice);
    return (
        <Form.Row className="mt-3">
            <Col sm={6}>
                <InputGroup className="mb-3">
                    <InputGroup.Checkbox />
                    <Form.Control placeholder="Option" value={choice.choiceTitle} isInvalid={props.errors ? props.errors.includes(choice.id) : false} onChange={(ev) => props.handleChoice(ev, choice.id)} />
                    <Form.Control.Feedback type="invalid">Please enter a valid option</Form.Control.Feedback>
                </InputGroup>
            </Col>
            {props.nChoices === choice.id ?
                <Col sm={1}>
                    {choice.id < 10 ?
                        <Button className="mt-1" size="sm" variant="outline-success" onClick={() => props.addChoice()}> <PlusCircle /> </Button> :
                        <Button className="mt-1" size="sm" variant="outline-danger" onClick={() => props.deleteChoice(choice.id)}> <XCircle /> </Button>}
                </Col> :
                <Col sm={1}>
                    <Button className="mt-1" size="sm" variant="outline-danger" onClick={() => props.deleteChoice(choice.id)}> <XCircle /> </Button>
                </Col>}
            {choice.id === 1 ? <>
                <Col sm={1}>
                    <Form.Label column>Max: </Form.Label>
                </Col>
                <Col sm={1}>
                    <Form.Control className="mt-1" as="select" defaultValue="number" onChange={(ev) => { props.handleMax(ev) }}>
                        {[...Array(props.nChoices)].map((n, i) => <option key={`opt${i}`}>{i + 1}</option>)}
                    </Form.Control>
                </Col> </> :
                <></>}
        </Form.Row>
    );
};


export default Questionary;