import React, { useState } from 'react';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../auth';
import '../styles/signup_login.css';

// Description: This component provides a login form for users to log in to the Fit & Meet application.
const LoginPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const history = useHistory();
    const [loginError, setLoginError] = useState(false);

    // Description: Function to handle user login.
    const loginUser = (data) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data})
        };

        fetch('/auth/login', requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log('API Response Data:', data); // Debugging statement
                if (data.access_token) {
                    login(data.access_token);

                    // Check if the username field exists in the API response
                    const username = data.username || 'User';
                    console.log('Username:', username); // Debugging statement
                    sessionStorage.setItem('username', username);

                    history.push('/');
                } else {
                    setLoginError(true);
                }
            })
            .catch((error) => {
                console.error('Login failed:', error);
                setLoginError(true);
            });

        reset();
    };

    return (
        <div className="container mt-5">
            <h2 className="page-title">Login to Fit & Meet</h2>
            {loginError && <Alert variant="danger">Invalid username or password</Alert>}
            <form onSubmit={handleSubmit(loginUser)}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Your username"
                        {...register('username', { required: true, maxLength: 25 })}
                        isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.username && (
                            <small style={{ color: 'red' }}>Username is required and should be 25 characters max</small>
                        )}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Your password"
                        {...register('password', { required: true, minLength: 8 })}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password && (
                            <small style={{ color: 'red' }}>Password is required and should be at least 8 characters</small>
                        )}
                    </Form.Control.Feedback>
                </Form.Group>

                <div className="text-center">
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </div>

                <Form.Group className="mt-3 text-center">
                    <small>Do not have an account? <Link to="/signup">Create One</Link></small>
                </Form.Group>
            </form>
        </div>
    );
};

export default LoginPage;
