import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Alert, Container, Row, Col, Table } from 'react-bootstrap';
import '../../styles/LoggedOutHome.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExercisePageMain = () => {
    const [permissions, setPermissions] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [exercisesList, setExercisesList] = useState({
        message: "No exercises found",
        success: false,
        exercises: []
    });

    useEffect(() => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        // Check if user is logged in
        if (!token) {
            console.log("User not logged in");
            setError("Access denied. Please log in to view this page.");
            return;
        }

        // Fetch user permissions
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
            setPermissions(data.permissions);
        }).catch(error => {
            console.error('Fetch permissions error:', error);
            setError('Failed to fetch user permissions');
        });

        // Fetch exercises list (if trainee then fetch only trainee's exercises, if trainer then fetch trainer's exercises)
        fetch('/exercise/exercises-list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch exercises');
            }
            return response.json();
        }).then(data => {
            console.log('Exercises: ', data);
            setExercisesList(data);
            setIsLoading(false);
        }).catch(error => {
            console.error('Fetch exercises error:', error);
            setError('Failed to fetch exercises');
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

        // Handle trainee permissions here
        if (permissions === 'trainee') {
            fetch(`/exercise/exercise/${id}`, {
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
            }
            ).then(data => {
                console.log(data);
                // Refresh the page after deleting the exercise
                window.location.reload();
            }).catch(error => {
                console.error('Delete exercise error:', error);
                setError('Failed to delete exercise');
            });
        }

        // Handle trainer permissions here (also admin act as a trainer)
        else if (permissions === 'trainer' || permissions === 'admin') {
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
                setExercisesList(prevExercises => prevExercises.filter(exercise => exercise.id !== id));
            }).catch(error => {
                console.error('Delete exercise error:', error);
                setError('Failed to delete exercise');
            });
        }
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
        <Container fluid="md">
            <Row>
                <Col>
                    <h1> { (permissions === 'trainer' || permissions === 'admin') ? 'Your Exercises' : 'Registered Exercises'} </h1>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exercisesList.exercises && exercisesList.exercises.map((exercise, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{exercise.title}</td>
                            <td>{exercise.date}</td>
                            <td>{exercise.description}</td>
                            <td>
                                <Link to={`/exercises/details/${exercise.id}`}>
                                    <Button variant="primary">Details</Button>
                                </Link>

                                {permissions === 'trainer' && <Link to={`/exercises/edit/${exercise.id}`}><Button variant="primary">Edit</Button></Link>}
                                <Button variant="danger" onClick={() => deleteExercise(exercise.id)}>{ (permissions === 'trainer' || permissions === 'admin') ? 'Delete' : 'Unregister'}</Button>
                            </td>
                        </tr>
                    ))}

                    {exercisesList.message && <tr><td colSpan="5">{exercisesList.message}</td></tr>}
                </tbody>
            </Table>
        </Container>
    );
};

export default ExercisePageMain; // Export the ExercisePageMain component