import { Col, Container, Row, Button, Form, InputGroup } from "react-bootstrap";
import { ChevronUp, ChevronDown, PlusCircle, PlusLg, XLg } from "react-bootstrap-icons";
import MyNavbar from "./Navbar.js";
import { useState } from "react";


function Questionary(props) {
    const [title, setTitle] = useState('');
    const [errorTitle, setErrorTitle] = useState(false);
    const [questions, setQuestions] = useState([]);
    console.log(questions);

    const handleTitle = (event) => {
        const value = event.target.value;

        if (value) {
            setTitle(value);
            setErrorTitle(false);
        }
        else {
            setTitle('');
            setErrorTitle(true);
        }
    }

    const deleteQuestion = (id) => {
        setQuestions((oldQ) => {
            const old = [...oldQ];
            old.splice(oldQ.findIndex(q => q.id === id), 1);
            return old.map((q, i) => { return { ...q, id: i + 1 } });
        });
    }

    return <Container fluid>
        <MyNavbar></MyNavbar>
        <Row className="justify-content-center below-nav vheight-100">
            <Col sm={3}></Col>
            <Col sm={6} className="formBorder">
                <Form>
                    <Form.Group as={Row} controlId="formTitle">
                        <Col sm={11}>
                            <Form.Control size="lg" type="text" placeholder="Enter Title" value={title} onChange={(ev) => handleTitle(ev)} />
                        </Col>
                        <Col sm={1}>
                            <Button type="button" size="md" className="btn-primary addButton mt-1" onClick={() => setQuestions((old) => [...old, { id: old.length + 1, type: 0 }])}><PlusLg></PlusLg></Button>
                        </Col>
                    </Form.Group>
                    {questions.map((q) => <>
                        <Form.Row className="mt-3">
                            <Col sm={1}>
                                <Button type="button" size="sm" className="mt-1 btn-danger deleteButton" onClick={() => deleteQuestion(q.id)}><XLg></XLg></Button>
                            </Col>
                            <Col sm={3} className="mb-3">
                                <h3 className="mb-3">{`Question ${q.id}`}</h3>
                            </Col>
                            <Col>
                                <Row>
                                    <Col sm={1}>
                                        <Button className="mt-1" size="sm" variant="outline-success" onClick={() => { }}> <ChevronUp /> </Button>
                                    </Col>
                                    <Col sm={1}>
                                        <Button className="mt-1" size="sm" variant="outline-success" onClick={() => { }}> <ChevronDown /> </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Form.Row>
                        <Question key={q.id} setQuestions={setQuestions} question={q}></Question>
                    </>
                    )}
                </Form>
            </Col>
            <Col sm={3} className="formBackground"></Col>
        </Row>
        <Button type="button" className="btn btn-lg btn-primary fixed-right-bottom" onClick={() => { }}>
            Submit
        </Button>
    </Container>
};


function Question(props) {
    const [type, setType] = useState(0); //0 = text, 1 = multiple choice
    const questionChoices = props.question.choices ? props.question.choices : [];
    const [questionTitle, setQuestionTitle] = useState(props.question.title ? props.question.title : '');
    const [errorQuestionTitle, setErrorQuestionTitle] = useState(false);

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
            setErrorQuestionTitle(false);
        }
        else {
            setQuestionTitle('');
            props.setQuestions((oldQuestions) => {
                return oldQuestions.map((q) => {
                    if (q.id === props.key)
                        return {
                            ...q, title: ''
                        };
                    else return q;
                })
            });
            setErrorQuestionTitle(true);
        }
    }

    const handleQuestionType = (event) => {
        const value = event.target.value === "Text" ? 0 : 1;
        setType(value);
        props.setQuestions((oldQuestions) => {
            return oldQuestions.map((q) => {
                if (q.id === props.question.id)
                    return {
                        ...q,
                        type: value,
                        choices: [{ id: 1, choiceTitle: '' }]
                    };
                else return q;
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


    console.log(props.question);
    console.log(type);
    return <Row>
        <Col sm={11}>
            <div className="questionBorder">
                <Form.Group as={Row} controlId="formQuestion">
                    <Col sm={7}>
                        <Form.Control size="md" type="text" placeholder="Question" value={questionTitle} onChange={(ev) => handleQuestionTitle(ev)} />
                    </Col>
                    <Col sm={5}>
                        <Form.Control as="select" defaultValue="Text" onChange={(ev) => handleQuestionType(ev)}>
                            <option>Text</option>
                            <option>Multiple choice</option>
                        </Form.Control>
                    </Col>
                </Form.Group>

                {type ? questionChoices.map((c) => <MultipleChoiceRow key={c.id} nChoices={questionChoices.length} choice={c} addChoice={addChoice} handleChoice={handleChoice}></MultipleChoiceRow>) : ''}
            </div>
        </Col>
        <Col sm={1}>
            <Button type="button" size="md" className="btn-primary addButton mt-1" onClick={() => { }}><PlusLg></PlusLg></Button>
        </Col>
    </Row>
};

function MultipleChoiceRow(props) {
    const choice = props.choice;
    console.log("nchoice" + props.nChoices);
    console.log("choiceid" + choice.id);

    return (
        <Form.Row className="mt-3">
            <Col sm={6}>
                <InputGroup className="mb-3">
                    <InputGroup.Checkbox />
                    <Form.Control placeholder="Option" value={choice.choiceTitle} onChange={(ev) => props.handleChoice(ev, choice.id)} />
                </InputGroup>
            </Col>
            {props.nChoices === choice.id ? <Col sm={1}>
                <Button className="mt-1" size="sm" variant="outline-success" onClick={() => props.addChoice()}> <PlusCircle /> </Button>
            </Col> : ''}
        </Form.Row>
    );
};


export default Questionary;