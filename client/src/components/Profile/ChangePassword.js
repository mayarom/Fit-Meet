import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import '../../styles/profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Description: This component provides a change password form for users to change their password.
const ChangePasswordComponent = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const history = useHistory();
    const [passwordError, setPasswordError] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Fit & Meet | Change Password';
    }, []);

    // Description: Function to handle user password change.

    const changePassword = (data) => {
        if (data.new_password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (data.new_password === data.old_password) {
            setError("New password cannot be the same as the old password.");
            return;
        }

        if (data.new_password === data.confirm_password) {
            const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
            setError(null);
            const requestBody = {
                ...data
            };

            delete requestBody.confirm_password;

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(token)}`
                },
                body: JSON.stringify(requestBody)
            };

            fetch('/profile/change-password', requestOptions)
                .then((res) => res.json())
                .then((data) => {
                    console.log('API Response Data:', data); // Debugging statement
                    if (data.success) {
                        setPasswordSuccess(true);
                        setTimeout(() => {
                            history.push('/profile');
                        }, 3000);
                    } else {
                        setPasswordError(true);
                        setError(null);
                    }
                })
                .catch((error) => {
                    console.error('Password change failed:', error);
                    setPasswordError(false);
                    setError("Server failure: " + error);
                });

            reset();
        } else {
            setError("Passwords do not match, please try again.");
            return;
        }
    }

    return (
        <div className="container mt-5">
            <h2 as={Col} md="6" className="mb-3 text-center">Change Password</h2>
            {passwordError && <Alert variant="danger">Invalid password</Alert>}
            {passwordSuccess && <Alert variant="success">Password changed successfully</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <form onSubmit={handleSubmit(changePassword)}>
                <Form.Group controlId="formOldPassword" >
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Your old password"
                        {...register('old_password', { required: true, maxLength: 25 })}
                        isInvalid={!!errors.old_password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.old_password && errors.old_password.type === "required" && <p>This field is required</p>}
                        {errors.old_password && errors.old_password.type === "maxLength" && <p>Password cannot exceed 25 characters</p>}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formNewPassword" >
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Your new password"
                        {...register('new_password', { required: true, maxLength: 25 })}
                        isInvalid={!!errors.new_password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.new_password && errors.new_password.type === "required" && <p>This field is required</p>}
                        {errors.new_password && errors.new_password.type === "maxLength" && <p>Password cannot exceed 25 characters</p>}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formConfirmPassword" >
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control

                        type="password"
                        placeholder="Confirm your new password"
                        {...register('confirm_password', { required: true, maxLength: 25 })}
                        isInvalid={!!errors.confirm_password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.confirm_password && errors.confirm_password.type === "required" && <p>This field is required</p>}
                        {errors.confirm_password && errors.confirm_password.type === "maxLength" && <p>Password cannot exceed 25 characters</p>}
                    </Form.Control.Feedback>
                </Form.Group>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Button variant="primary" type="submit">
                        Change Password
                    </Button>

                    <Button variant="primary" onClick={() => reset()}>
                        Reset
                    </Button>

                    <Button variant="primary" onClick={() => history.push('/profile')}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordComponent; // Export the ChangePasswordComponent component