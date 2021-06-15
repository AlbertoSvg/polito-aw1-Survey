import { Col, Container, Row, Alert, Table } from "react-bootstrap";
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
                {message && <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>}
                <Table responsive="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Table cell</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        </Row>
    </Container>
};

export default GuestPage;