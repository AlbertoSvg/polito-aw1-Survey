import { Col, Container, Row, Button, Alert, Table, Spinner } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import Sidebar from "./Sidebar.js";
import { useState } from "react";
import { NavLink } from 'react-router-dom';



function AdminPage(props) {
    const [message, setMessage] = useState(props.message);
    const responses = 0 //da passare poi come prop

    return <Container fluid>
        <Row className="vheight-100">
            <Col sm={4} className="below-nav collapse d-sm-block bg-light" id="left-sidebar">
                <Sidebar setSurveysChanged={props.setSurveysChanged} doLogIn={props.doLogIn}></Sidebar>
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
                                <th className="col col-6">Title</th>
                                <th className="col col-1">Responses</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.surveys.map((s) => <SurveyRow key={s.id} survey={s} responses={responses}></SurveyRow>)}
                        </tbody>
                    </Table>
                    <NavLink to="/admin/add">
                        <Button type="button" className="btn btn-lg btn-primary fixed-right-bottom">
                            &#43;
                        </Button>
                    </NavLink>
                </>}
            </Col>
        </Row>
    </Container>


}

function SurveyRow(props) {
    const [popup, setPopup] = useState(false);
    return <tr>
        <SurveyRowData survey={props.survey} responses={props.responses} popup={popup} setPopup={setPopup}></SurveyRowData>
        <SurveyRowControl responses={props.responses} setPopup={setPopup}></SurveyRowControl>
    </tr>
}

function SurveyRowData(props) {
    return <>
        <td className="col col-2">{props.survey.id}</td>
        <td className="col col-6">{props.survey.title}</td>
        <td className="col col-1 inline">{props.responses} </td>
        <td className="col col-3"> {props.popup ? <Alert variant="warning" onClose={() => props.setPopup(false)} dismissible>No responses to see</Alert> : <></>} </td>
    </>
}

function SurveyRowControl(props) {

    return <td className="col col-2 text-right"><Button className="mt-1" size="sm" variant="outline-primary" onClick={() => !props.responses ? props.setPopup(true) : {}}> <Eye /> </Button></td>

}
export default AdminPage;
