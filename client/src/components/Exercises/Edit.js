import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Alert, Container, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import '../../styles/LoggedOutHome.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExercisePageEdit = () => {
    const { exerciseId } = useParams();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [exercisedata, setExerciseData] = useState({
        message: '',
        success: false,
        title: '',
        date: '',
        description: ''
    });

    useEffect(() => {
        document.title = 'Fit & Meet | Edit Exercise';

        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        if (!token) {
            console.log("User not logged in");
            setError("Access denied. Please log in to view this page.");
            return;
        }

        fetch(`/exercise/exercise/${exerciseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            }).then(data => {
                console.log("Exercise data:", data);

                if (data.success !== true) {
                    setError(data.message);
                    setIsLoading(false); // Stop loading
                    return;
                }

                setExerciseData(data);
                setIsLoading(false); // Stop loading
            })
            .catch(err => {
                console.error('Error fetching exercise:', err);
                setError('Failed to fetch exercise');
                setIsLoading(false); // Stop loading
            });
    }, [exerciseId]); // Only re-run effect if exerciseId changes

    const updateExercise = (data) => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        if (!token) {
            console.log("User not logged in");
            setError("Access denied. Please log in to view this page.");
            return;
        }

        setSubmitting(true);

        fetch(`/exercise/trainer-exercises/${exerciseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to update exercise');
            }
            return response.json();
        }).then(data => {
            console.log(data);
            setSuccess(data.message);
            setSubmitting(false);
        }).catch(error => {
            console.error('Update exercise error:', error);
            setError('Failed to update exercise');
            setSubmitting(false);
        });
    };

    if (isLoading) {
        return (
            <Container>
                <Alert variant="info">Fetching and loading data...</Alert>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <div className="auth-form-container mt-5">
            <h1 className="page-title">Edit Exercise</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit(updateExercise)} noValidate>
                <Form.Group as={Col} md="6" className="form-group">
                    <Form.Label htmlFor="title" className="form-label">Title</Form.Label>
                    <Form.Control
                        type="text"
                        id="title"
                        className="form-control"
                        defaultValue={exercisedata.title}
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
                        defaultValue={exercisedata.date}
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
                        defaultValue={exercisedata.description}
                        {...register('description', { required: 'Description is required', maxLength: 255 })}
                        isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.description?.message || (errors.description?.type === "maxLength" && "Description should be less than 255 characters")}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit">
                    {submitting ? <span><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...</span> : 'Save'}
                </Button>
            </Form>
        </div>
    );
};

export default ExercisePageEdit; // Export the ExercisePage component
