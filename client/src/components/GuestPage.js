import { Col, Container, Row, Alert, Table, Button, Spinner } from "react-bootstrap";
import { FileEarmarkText } from "react-bootstrap-icons";
import Sidebar from "./Sidebar.js";
import { NavLink } from 'react-router-dom';

function GuestPage(props) {

    return <Container fluid>
        <Row className="vheight-100">

            <Col sm={4} className="below-nav collapse d-sm-block bg-light" id="left-sidebar">
                <Sidebar setDirty={props.setDirty} ></Sidebar>
            </Col>

            <Col sm={8} className="below-nav">
                {props.loading ? <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner> : <>
                    {props.message && <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>}
                    <Table responsive="sm">
                        <thead>
                            <tr>
                                <th className="col col-2">#</th>
                                <th className="col col-3 text-right">Title</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.surveys.map((s) => <tr key={`tr-${s.id}`}>
                                <td>{s.id}</td>
                                <td className="col col-3 text-right">{s.title}</td>
                                {props.sending.state && props.sending.idS===s.id ? <td className="col text-right text-primary">Sending... <Spinner size="sm" animation="border" role="status"></Spinner></td> : <td className="col text-right text-primary"></td>}
                                <td className="col col-2 text-right"><NavLink to={{
                                    pathname: "/surveys/compile",
                                    state: { survey: s }
                                }}><Button className="mt-1" size="sm" variant="outline-primary" onClick={() => { }}> <FileEarmarkText /> </Button></NavLink></td>
                            </tr>)}
                        </tbody>
                    </Table>
                </>}
            </Col>
        </Row>
    </Container>
};

export default GuestPage;