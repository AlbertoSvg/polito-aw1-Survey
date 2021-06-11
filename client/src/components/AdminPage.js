import { Col, Container, Row, Button, Alert } from "react-bootstrap";
import Sidebar from "./Sidebar.js";
import { useState } from "react";


function AdminPage(props) {
    const [message, setMessage] = useState(props.message);

    return <Container fluid>
            <Row className="vheight-100">
                <Col sm={4} className="below-nav collapse d-sm-block bg-light" id="left-sidebar">
                    <Sidebar doLogIn={props.doLogIn}></Sidebar>
                </Col>

                <Col sm={8} className="below-nav">
                    {message && <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>}
                    <Button type="button" className="btn btn-lg btn-primary fixed-right-bottom" onClick={() => { }}>
                        &#43;
                    </Button>

                </Col>
            </Row>
        </Container>
    
}

export default AdminPage;
