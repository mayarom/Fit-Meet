import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { UserContext } from '../contexts/UserContext';
import '../styles/main.css';

const Profilecomponent = ({ username, email, age, city, goal, experience, phone, onClick, onDelete }) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{username}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{email}</Card.Subtitle>
                <Card.Text>{age}</Card.Text>
                <Card.Text>{city}</Card.Text>
                <Card.Text>{goal}</Card.Text>
                <Card.Text>{experience}</Card.Text>
                <Card.Text>{phone}</Card.Text>
                <Button variant="primary" onClick={onClick}>Edit</Button>
                <Button variant="danger" onClick={onDelete}>Delete</Button>
            </Card.Body>
        </Card>
    );
}

const Profile = ({ showModalFn }) => {
    const { user, updateUser } = useContext(UserContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Fetching user data from the database...");
                const response = await fetch(`/auth/profile/${user.userID}`); // Replace with your API endpoint for fetching user data

                console.log("After fetching user data...");

                if (!response.ok) {
                    throw new Error(`Failed to fetch user data, response status: ${response.status}`);
                }

                const userData = await response.json();
                console.log("Fetched user data:", userData);
                updateUser(userData);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        console.log("Fetching user data...");
        fetchUserData();
    }, [updateUser]);

    const createExercise = async (data) => {
        try {
            setSubmitting(true);

            // Implement your logic for creating an exercise here
            const response = await fetch('/api/createExercise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: user.userID,
                    name: data.name,
                    date: data.date,
                    description: data.description,
                }),
            });

            // Check if the exercise creation was successful and handle accordingly
            if (response.ok) {
                setMessage({ text: 'Exercise created successfully', type: 'success' });
            } else {
                setMessage({ text: 'Failed to create exercise', type: 'danger' });
            }

            setSubmitting(false);
        } catch (error) {
            console.error("Error creating exercise: ", error);
            setMessage({ text: 'Failed to create exercise', type: 'danger' });
        }
    };

    if (isLoading) {
        console.log("Loading user data...");
        console.log("user data: ", user);

        return <div>Loading...</div>;
    }

    if (!user) {
        console.error("Error loading user data.");
        return <div>Error loading user data.</div>;
    }

    return (
        <Container>
            <Row className="container mt-5">
                <Col>
                    <h1 className="profile-title mb-4">Profile</h1>
                    <div className="profile-details">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Age:</strong> {user.age}</p>
                        <p><strong>City:</strong> {user.city}</p>
                        {user.permissions === 'trainer' ? (
                            <>
                                <p><strong>Experience:</strong> {user.experience}</p>
                                <p><strong>Phone:</strong> {user.phone}</p>
                            </>
                        ) : (
                            // Render trainee-specific details here
                            <>
                                {/* Add trainee-specific details */}
                            </>
                        )}
                    </div>
                    <Button variant="primary" onClick={showModalFn}>Update</Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h2 className="mt-4">Create Exercise</h2>
                    <Form onSubmit={handleSubmit(createExercise)}>
                        <Form.Group controlId="formExerciseName">
                            <Form.Label>Exercise Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter exercise name"
                                {...register('name', { required: true })}
                            />
                            {errors.name && <Form.Text className="text-danger">Exercise name is required</Form.Text>}
                        </Form.Group>

                        <Form.Group controlId="formExerciseDate">
                            <Form.Label>Exercise Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Enter exercise date"
                                {...register('date', { required: true })}
                            />
                            {errors.date && <Form.Text className="text-danger">Exercise date is required</Form.Text>}
                        </Form.Group>

                        <Form.Group controlId="formExerciseDescription">
                            <Form.Label>Exercise Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter exercise description"
                                {...register('description', { required: true })}
                            />
                            {errors.description && <Form.Text className="text-danger">Exercise description is required</Form.Text>}
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={submitting}>
                            {submitting ? 'Creating Exercise...' : 'Create Exercise'}
                        </Button>
                    </Form>
                    {message.text && <Alert variant={message.type}>{message.text}</Alert>}
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
