import { Navbar, Button, Form, FormControl, Container, Dropdown, ButtonGroup, ListGroup, Row, Col } from 'react-bootstrap';
import logo1 from '../logo1.svg'
import logo2 from '../logo2.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import { LogoutButton, LoginButton } from "./LoginComponent.js";
import { NavLink } from 'react-router-dom';
import {JustifyLeft } from 'react-bootstrap-icons'

function MyNavbar(props) {
    return (
        <Navbar className="navbar" variant="dark" expand="sm" bg="primary" fixed="top">
            <Container fluid>
                <Button className="navbar-toggler" type="button" variant="outline-success" bg="success">
                    <span className="navbar-toggler-icon"></span>
                </Button>
                <Navbar.Brand>
                    <Row>
                    <Col sm={3}><JustifyLeft width="30px" height="30px"></JustifyLeft></Col>
                    <Col sm={1}>Questionary</Col>
                    </Row>
                </Navbar.Brand>
                <Form inline className="my-2 my-lg-0 mx-auto d-none d-sm-block">
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                </Form>
                <Navbar.Brand>
                    
                        <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle type="button" variant="" id="dropdown-split-basic">  
                                <img
                                    src={logo2}
                                    width="30"
                                    height="30"
                                    alt=""
                                />
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="left-menu">
                                <h4 className="text-center">User Profile</h4>
                                <ListGroup variant="flush">
                                    <ListGroup.Item className="float-left">
                                        <strong>Id: </strong>
                                        <span>{props.loggedIn ? props.user.id : ''}</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="float-left">
                                        <strong>Name: </strong>
                                        <span>{props.loggedIn ? props.user.name : ''}</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="float-left"><strong>Username: </strong>
                                        <span>{props.loggedIn ? props.user.username : 'Guest'}</span>
                                    </ListGroup.Item>
                                </ListGroup>
                                {props.loggedIn ? <LogoutButton logout={props.doLogOut}></LogoutButton> : <NavLink to="/login"><LoginButton></LoginButton></NavLink>}
                            </Dropdown.Menu>
                        </Dropdown>
    
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default MyNavbar;