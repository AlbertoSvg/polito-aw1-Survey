import { Form, Button, Alert, Col } from 'react-bootstrap';
import { useState } from 'react';

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const handleUsername = (event) => {
        const value = event.target.value;
        if (value === null || value === '') {
            setErrorUsername('Username cannot be empty');
            setUsername('');
        }
        else {
            setUsername(value);
            setErrorUsername('')
        }
    }

    const handlePassword = (event) => {
        const value = event.target.value;
        if (value === null || value === '') {
            setErrorPassword('Password cannot be empty');
            setPassword('');
        }
        else {
            setPassword(value);
            setErrorPassword('');
        }

        if (value.length < 4 && value.length > 0) {
            setErrorPassword('Password must contain at least 6 characters');
        }

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');

        if(!errorPassword && !errorUsername) {
            const credentials = { username: username, password: password };
            props.login(credentials).then((err) => {
                if (err) {
                    setErrorMessage(err);
                }
            }).catch(() => console.log('failed'));
        }
        else {
            setErrorMessage('Unable to login');
        }
    };

    return (
        <div className="below-nav center-login">
            <Form className="form-show">
                <h2 className="h2-form" >Sign In</h2>
                { errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                <Form.Group controlId='username'>
                    <Form.Label>User email</Form.Label>
                    <Form.Control type='email' value={username} onChange={ev => handleUsername(ev)} />
                </Form.Group>
                { errorUsername ? <span className="form-control-feedback">{errorUsername}</span> : ''}
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' value={password} onChange={ev => handlePassword(ev)} />
                </Form.Group>
                { errorPassword ? <span className="form-control-feedback">{errorPassword}</span> : ''}
                <Button onClick={handleSubmit}>Login</Button>
            </Form>
        </div>
    )

}

function LogoutButton(props) {
    return (
        <Col>
            <Button variant="outline-primary" className="float-right" onClick={props.logout}>Logout</Button>
        </Col>
    )
}

function LoginButton(props) {
    return (
        <Col>
            <Button variant="outline-primary" className="float-right">Login</Button>
        </Col>
    )
}

export { LoginForm, LogoutButton, LoginButton };