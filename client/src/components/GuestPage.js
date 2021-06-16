import { Col, Container, Row, Alert, Table, Button, Spinner } from "react-bootstrap";
import { FileEarmarkText } from "react-bootstrap-icons";
import Sidebar from "./Sidebar.js";
import { useState } from "react";

function GuestPage(props) {
    const [message, setMessage] = useState('');

    return <Container fluid>
        <Row className="vheight-100">

            <Col sm={4} className="below-nav collapse d-sm-block bg-light" id="left-sidebar">
                <Sidebar setSurveysChanged={props.setSurveysChanged} ></Sidebar>
            </Col>

            <Col sm={8} className="below-nav">
                {props.loading ? <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner> : <>
                    {message && <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>}
                    <Table responsive="sm">
                        <thead>
                            <tr>
                                <th className="col col-2">#</th>
                                <th className="col col-2">Title</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.surveys.map((s) => <tr>
                                <td>{s.id}</td>
                                <td className="col col-2">{s.title}</td>
                                <td className="col col-2 text-right"><Button className="mt-1" size="sm" variant="outline-primary" onClick={() => { }}> <FileEarmarkText /> </Button></td>
                            </tr>)}
                        </tbody>
                    </Table>
                </>}
            </Col>
        </Row>
    </Container>
};

export default GuestPage;