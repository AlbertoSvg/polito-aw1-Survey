import { Col, Container, Row, Button, Alert, Table } from "react-bootstrap";
import Sidebar from "./Sidebar.js";
import { useState } from "react";
import { NavLink } from 'react-router-dom';



function AdminPage(props) {
    const [message, setMessage] = useState(props.message);

    return <Container fluid>
        <Row className="vheight-100">
            <Col sm={4} className="below-nav collapse d-sm-block bg-light" id="left-sidebar">
                <Sidebar setSurveysChanged={props.setSurveysChanged} doLogIn={props.doLogIn}></Sidebar>
            </Col>

            <Col sm={8} className="below-nav">
                {message && <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>}
                <Table responsive="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Responses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.surveys.map((s) => <tr>
                            <td>{s.id}</td>
                            <td>{s.title}</td>
                            <td>0</td>
                        </tr>)}
                    </tbody>
                </Table>
                <NavLink to="/admin/add">
                    <Button type="button" className="btn btn-lg btn-primary fixed-right-bottom">
                        &#43;
                    </Button>
                </NavLink>
            </Col>
        </Row>
    </Container>


}

export default AdminPage;
