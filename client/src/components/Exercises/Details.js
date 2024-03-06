import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import '../../styles/LoggedOutHome.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExercisePageDetails = () => {
    const { exerciseId } = useParams();
    const prevExerciseIdRef = useRef();
    const [permissions, setPermissions] = useState(null); // ['trainee', 'trainer', 'admin']
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState({
        message: "Exercise not found",
        success: false,
        exercise: {
            id: 0,
            title: "",
            date: "",
            description: "",
            trainername: "",
            trainerID: 0
        }
    });

    useEffect(() => {
        document.title = 'Fit & Meet | Exercise Details';

        if (prevExerciseIdRef.current !== exerciseId) {
            setIsLoading(true); // Start loading

            const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

            if (!token) {
                console.log("User not logged in");
                setError("Access denied. Please log in to view this page.");
                return;
            }

            // Before fetching the exercise details, fetch the user permissions, then fetch the exercise details
            fetch(`/auth/get-permissions`, {
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
                setIsLoading(false);
                return null;
            });

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
                })
                .then(data => {
                    console.log("Exercise data:", data);

                    if (data.success !== true) {
                        setError(data.message);
                        setIsLoading(false); // Stop loading
                        return;
                    }

                    setExercises(data);
                    setIsLoading(false); // Stop loading
                })
                .catch(err => {
                    console.error('Error fetching exercise:', err);
                    setError('Failed to fetch exercise');
                    setIsLoading(false); // Stop loading
                });

            prevExerciseIdRef.current = exerciseId; // Update previous exerciseId
        }
    }, [exerciseId]); // Only re-run effect if exerciseId changes

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
                    <h1>Exercise Details</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>{exercises.title}, by <Link to={`/profile/${exercises.trainerID}`}>{exercises.trainername}</Link></Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{exercises.date}</Card.Subtitle>
                            <Card.Text>{exercises.description}</Card.Text>
                            {permissions === 'trainer' && <Link to={`/exercises/details/${exercises.id}/edit`}><Button variant="primary">Edit</Button></Link>}
                            <Button variant="secondary" onClick={() => window.history.back()}>Back</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );

};

export default ExercisePageDetails; // Export the ExercisePageDetails component