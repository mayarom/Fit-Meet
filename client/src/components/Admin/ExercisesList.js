import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Alert, Container, Table, Row, Col } from 'react-bootstrap';
import '../../styles/admin.css';

const AdminExercisesComponent = () => {
    const [exercisesList, setExercisesList] = useState({
        message: '',
        success: false,
        exercises: [
            {
                id: '',
                name: '',
                date: '',
                description: '',
                trainer_id: 0,
                trainer_name: '',
                registered_users: [
                    {
                        id: 0,
                        name: ''
                    }
                ]
            }
        ]
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        if (!token) {
            console.log("User not logged in");
            setError("Access denied. Please log in to view this page.");
            setIsLoading(false);
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
            console.log('User permissions:', data);

            if (data.permissions === 'admin') {
                fetch('/exercise/exercise-list-all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(token)}`
                    }
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch exercises data');
                    }
                    return response.json();
                }).then(data => {
                    if (!data.success) {
                        setError(data.message);
                        setIsLoading(false);
                        return;
                    }
                    console.log('Exercises data:', data);
                    setExercisesList(data);
                    setIsLoading(false);
                }).catch(error => {
                    console.error('Fetch exercises data error:', error);
                    setError('Failed to fetch exercises data:' + error);
                    setIsLoading(false);
                });
            }

            else {
                // Error: user does not have permission to view exercises list
                console.error('User does not have permission to view exercises list');
                setError('You do not have permission to view exercises list');
                setIsLoading(false);
            }
        }).catch(error => {
            console.error('Fetch user permissions error:', error);
            setError('Failed to fetch user permissions');
            setIsLoading(false);
        });
    }, []);

    const deleteExercise = (id) => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        if (!token) {
            console.log("User not logged in");
            setError("Access denied. Please log in to view this page.");
            return;
        }

        fetch(`/exercise/trainer-exercises/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete exercise');
            }
            return response.json();
        }).then(data => {
            console.log(data);

            // Refresh exercises list
            window.location.reload();
        }).catch(error => {
            console.error('Delete exercise error:', error);
            setError('Failed to delete exercise');
        });
    };

    if (isLoading) {
        return (
            <Container>
                <Alert variant="info">Fetching exercises data...</Alert>
            </Container>
        );
    }

    else if (error) {
        return (
            <Container>
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid="md">
            <Row>
                <Col>
                    <h1>Exercises List</h1>
                </Col>
            </Row>
            <Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Exercise Name</th>
                            <th>Exercise Date</th>
                            <th>Exercise Description</th>
                            <th>Trainer Name</th>
                            <th>Registered Trainees</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exercisesList.exercises.map((exercise, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{exercise.title}</td>
                                <td>{exercise.date}</td>
                                <td>{exercise.description}</td>
                                <td><Link to={`/profile/${exercise.trainer_id}`}>{exercise.trainer_name}</Link></td>
                                <td>{ (exercise.registered_users.length > 0) ?
                                        exercise.registered_users.map((trainee, index) => (
                                            <div key={index}>
                                                <Link to={`/profile/${trainee.id}`}>{trainee.username}</Link>
                                            </div>
                                    ))
                                    : "No trainees registered"
                                }</td>

                                <td>
                                    <Link to={`/exercises/edit/${exercise.id}`}><Button variant="info">Edit</Button></Link>
                                    <Link to={`/exercises/details/${exercise.id}`}><Button variant="primary">Details</Button></Link>
                                    <Button variant="danger" onClick={() => deleteExercise(exercise.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
};

export default AdminExercisesComponent; // Export the AdminExercisesComponent component