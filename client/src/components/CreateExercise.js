import React, { useState } from 'react';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const CreateExercisePage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const createExercise = (data) => {
        setSubmitting(true);
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
            body: JSON.stringify(data),
        };

        console.log("We are in exercise/exercises"); // Corrected print statement
        fetch('/exercise/exercises', requestOptions)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok, error code: ' + res.status);
                }
                return res.json();
            })
            .then(data => {
                reset();
                setMessage({ text: 'Exercise created successfully!', type: 'success' });
            })
            .catch(err => {
                setMessage({ text: err.message, type: 'danger' });
            })
            .finally(() => {
                setSubmitting(false);
            });
        console.log("finished exercise/exercises"); // Corrected print statement
    };

    return (
        <div className="container mt-5">
            <h1>Create An Exercise</h1>
            {message.text && <Alert variant={message.type}>{message.text}</Alert>}
            <Form onSubmit={handleSubmit(createExercise)} noValidate>
                <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label htmlFor="title">Title</Form.Label>
                    <Form.Control
                        type="text"
                        id="title"
                        {...register('title', { required: 'Title is required', maxLength: 25 })}
                        isInvalid={!!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.title?.message || (errors.title?.type === "maxLength" && "Title should be less than 25 characters")}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label htmlFor="date">Date</Form.Label>
                    <Form.Control
                        type="date"
                        id="date"
                        {...register('date', { required: 'Date is required' })}
                        isInvalid={!!errors.date}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.date?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="12" className="mb-3">
                    <Form.Label htmlFor="description">Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        id="description"
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

export default CreateExercisePage;
