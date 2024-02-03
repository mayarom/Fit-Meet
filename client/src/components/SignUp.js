import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import '../styles/signup.css';

const SignUpPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [showAlert, setShowAlert] = useState(false);
    const [serverResponse, setServerResponse] = useState('');

    const submitForm = (data) => {
        if (data.password === data.confirmPassword) {
            const requestBody = {
                ...data
            };
            delete requestBody.confirmPassword; // Remove confirmPassword from the request body

            const requestOptions = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            };

            fetch('/auth/signup', requestOptions)
                .then(res => res.json())
                .then(responseData => {
                    setShowAlert(true);
                    if (responseData.success) {
                        setServerResponse("User created successfully");
                        reset(); // Reset the form fields
                    } else {
                        setServerResponse(responseData.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setServerResponse("An error occurred. Please try again.");
                    setShowAlert(true);
                });
        } else {
            setServerResponse("Passwords do not match");
            setShowAlert(true);
        }
    };

    return (
        <div className="container mt-5">
            <div className="signup-form">
                {showAlert && (
                    <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                        <p>{serverResponse}</p>
                    </Alert>
                )}
                <h1 className="signup-title">Sign Up for Fit & Meet</h1>
                <Form onSubmit={handleSubmit(submitForm)}>
                    {/* Form fields and controls */}
                    {/* Username */}
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" {...register("username", { required: true })} />
                        {errors.username && <p className="error-message">Username is required.</p>}
                    </Form.Group>
                    
                    {/* Age */}
                    <Form.Group controlId="formBasicAge">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="number" placeholder="Enter age" {...register("age", { required: true })} />
                        {errors.age && <p className="error-message">Age is required.</p>}
                    </Form.Group>
                    
                    {/* Date of Birth */}
                    <Form.Group controlId="formBasicDob">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" {...register("dob", { required: true })} />
                        {errors.dob && <p className="error-message">Date of Birth is required.</p>}
                    </Form.Group>
                    
                    {/* City */}
                    <Form.Group controlId="formBasicCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" placeholder="Enter city" {...register("city", { required: true })} />
                        {errors.city && <p className="error-message">City is required.</p>}
                    </Form.Group>
                    
                    {/* Goal */}
                    <Form.Group controlId="formBasicGoal">
                        <Form.Label>Goal</Form.Label>
                        <Form.Control type="text" placeholder="Enter goal" {...register("goal", { required: true })} />
                        {errors.goal && <p className="error-message">Goal is required.</p>}
                    </Form.Group>
                    
                    {/* Experience (for trainers) */}
                    <Form.Group controlId="formBasicExperience">
                        <Form.Label>Experience</Form.Label>
                        <Form.Control type="text" placeholder="Enter experience" {...register("experience")} />
                    </Form.Group>

                    {/* Is Trainer */}
                    <Form.Group controlId="formBasicIsTrainer">
                        <Form.Label>Are you a trainer?</Form.Label>
                        <Form.Check type="checkbox" label="Yes" {...register("is_trainer", { required: true })} />
                        {errors.is_trainer && <p className="error-message">This field is required.</p>}
                    </Form.Group>
                    
                    {/* Email */}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" {...register("email", { required: true })} />
                        {errors.email && <p className="error-message">Email is required.</p>}
                    </Form.Group>
                    
                    {/* Phone */}
                    <Form.Group controlId="formBasicPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="text" placeholder="Enter phone" {...register("phone", { required: true })} />
                        {errors.phone && <p className="error-message">Phone is required.</p>}
                    </Form.Group>
                    
                    {/* Password */}
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" {...register("password", { required: true })} />
                        {errors.password && <p className="error-message">Password is required.</p>}
                    </Form.Group>
                    
                    {/* Confirm Password */}
                    <Form.Group controlId="formBasicConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm password" {...register("confirmPassword", { required: true })} />
                        {errors.confirmPassword && <p className="error-message">Confirm password is required.</p>}
                    </Form.Group>
                    
                    {/* Submit Button */}
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </div>
        </div>
    );
}

export default SignUpPage;
