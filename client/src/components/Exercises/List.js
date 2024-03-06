import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {  Button, Alert, Container, Row, Col, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import '../../styles/LoggedOutHome.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExercisePageList = () => {
    const { userid } = useParams();
    const { handleSubmit } = useForm();
    const prevUserIdRef = useRef();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState({
        message: "No exercises found",
        success: false,
        exercises: []
    });

    useEffect(() => {
        document.title = 'Fit & Meet | Trainer Exercises';

        if (prevUserIdRef.current !== userid) {
            setIsLoading(true); // Start loading

            const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

            if (!token) {
                console.log("User not logged in");
                setError("Access denied. Please log in to view this page.");
                return;
            }

            console.log("Fetching exercises for trainer ID:", userid);

            fetch(`/exercise/exercise-list/${userid}`, {
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
                    console.log("User data:", data);

                    if (data.success !== true) {
                        setError(data.message);
                        setIsLoading(false); // Stop loading
                        return;
                    }

                    setExercises(data);
                    setIsLoading(false); // Stop loading
                })
                .catch(err => {
                    console.error('Error fetching exercises:', err);
                    setError('Failed to fetch exercises');
                    setIsLoading(false); // Stop loading
                });

            prevUserIdRef.current = userid; // Update previous userid
        }
    }, [userid]); // Only re-run effect if userid changes

    const registerExercise = (id) => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        if (!token) {
            console.log("User not logged in");
            setError("Access denied. Please log in to view this page.");
            return;
        }

        fetch(`/exercise/exercise/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to register exercise');
            }
            return response.json();
        }).then(data => {
            console.log(data);
            window.location.reload();
        }).catch(error => {
            console.error('Register exercise error:', error);
            setError('Failed to register exercise');
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
        <Container fluid="md">
            <Row>
                <Col>
                    <h1> {userid ? `Exercises for Trainer ID: ${userid}` : 'Exercises List'} </h1>
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
                    {exercises.exercises.map((exercise, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{exercise.title}</td>
                            <td>{exercise.date}</td>
                            <td>{exercise.description}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleSubmit(registerExercise(exercise.id))}>Register</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Row>
                <Col>
                    <Button variant="primary" onClick={() => window.history.back()}>Back</Button>
                </Col>
            </Row>
        </Container>
    );

};

export default ExercisePageList; // Export the ExercisePage component
