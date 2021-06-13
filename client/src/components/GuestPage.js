import { Col, Container, Row, Alert } from "react-bootstrap";
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

            </Col>
        </Row>
    </Container>
};

export default GuestPage;