import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import '../../styles/LoggedOutHome.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExercisePageCreate = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const createExercise = (data) => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        if (!token) {
            console.log("User not logged in");
            setError("Access denied. Please log in to view this page.");
            return;
        }

        setSubmitting(true);

        fetch('/exercise/create-exercise', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to create exercise');
            }
            return response.json();
        }).then(data => {
            console.log(data);
            setSuccess(data.message);
            setSubmitting(false);
        }).catch(error => {
            console.error('Create exercise error:', error);
            setError('Failed to create exercise');
            setSubmitting(false);
        });
    };

    useEffect(() => {
        document.title = 'Fit & Meet | Create Exercise';

        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        if (!token) {
            console.log("User not logged in");
            setError("Access denied. Please log in to view this page.");
            return;
        }

        fetch('/auth/get-permissions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user permissions');
            }
            return response.json();
        }).then(data => {
            if (data.permissions !== 'trainer' && data.permissions !== 'admin') {
                setError('You do not have permission to view this page');
            }
        }).catch(error => {
            console.error('Fetch permissions error:', error);
            setError('Failed to fetch user permissions');
        });
    }, []);

    return (
        <div className="auth-form-container mt-5">
            <h1 className="page-title">Create An Exercise</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit(createExercise)} noValidate>
                <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label htmlFor="title" className="form-label">Title</Form.Label>
                    <Form.Control
                        type="text"
                        id="title"
                        className="form-control"
                        {...register('title', { required: 'Title is required', maxLength: 25 })}
                        isInvalid={!!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.title?.message || (errors.title?.type === "maxLength" && "Title should be less than 25 characters")}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label htmlFor="date" className="form-label">Date</Form.Label>
                    <Form.Control
                        type="date"
                        id="date"
                        className="form-control"
                        {...register('date', { required: 'Date is required' })}
                        isInvalid={!!errors.date}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.date?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="12" className="form-group">
                    <Form.Label htmlFor="description" className="form-label">Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        id="description"
                        className="form-control"
                        {...register('description', { required: 'Description is required', maxLength: 255 })}
                        isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.description?.message || (errors.description?.type === "maxLength" && "Description should be less than 255 characters")}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? <span><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...</span> : 'Save'}
                </Button>
            </Form>
        </div>
    );
};

export default ExercisePageCreate; // Export the ExercisePageCreate component