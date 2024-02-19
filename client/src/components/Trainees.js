import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Alert, Container, Card } from 'react-bootstrap';
import '../styles/trainers_trainees.css';

const TraineesPage = () => {
    const [permissions, setPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trainees, setTrainees] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        // Fetch user permissions.
        fetch('/auth/get-permissions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user permissions');
                }
                return response.json();
            })
            .then(data => {
                const userPermissions = data.permissions;
                setPermissions(userPermissions);

                if (userPermissions !== 'trainer' && userPermissions !== 'admin') {
                    setError('You do not have permission to view this page');
                    setIsLoading(false);
                    return;
                }

                // Now fetch the data of the trainees.
                fetch('/lists/trainees-list/registered', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(token)}`
                    }
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch trainees data');
                    }
                    return response.json();
                }).then(data => {
                    console.log('Trainees data:', data);
                    setTrainees(data);
                    setIsLoading(false);
                }).catch(error => {
                    console.error('Fetch trainees data error:', error);
                    setError('Failed to fetch trainees data:' + error);
                    setIsLoading(false);
                });

            })
            .catch(error => {
                console.error('Fetch permissions error:', error);
                setError('Failed to fetch user permissions:' + error);
                setIsLoading(false);
            });
    }, []);


    if (isLoading) {
        return (<Container fluid="md"><Alert variant="info">Fetching user permissions and data...</Alert></Container>);
    }

    else if (error) {
        return (<Container fluid="md"><Alert variant="danger">{error}</Alert></Container>);
    }

return (
    <Container className="auth-form-container mt-5">
        <Card>
            <h1 className="profile-title text-center">Trainees</h1>
            <Card.Body>
                <Card.Text className="text-center">
                    View all trainees that are registered to your exercises.
                </Card.Text>

                {trainees.length === 0 ? (
                    <div>No trainees are registered to your exercises yet.</div>
                ) : (
                    trainees.map((trainee, index) => {
                        return (
                            <Card key={index} style={{marginBottom: '10px'}}>
                                <Card.Body>
                                    <Card.Title>Name: {trainee.name}</Card.Title>
                                    <Card.Text>
                                        <strong>ID:</strong> {trainee.id}<br />
                                        <strong>City:</strong> {trainee.city} <br />
                                        <strong>Email:</strong> {trainee.email} <br />
                                        <strong>Phone:</strong> {trainee.phone}
                                    </Card.Text>
                                    
                                    <Card.Title>Registered exercises:</Card.Title>
                                    {trainee.exercises.map((exercise, index) => {
                                        return (
                                            <Card.Text key={index}>
                                                <strong>Name:</strong> {exercise.name} <br />
                                                <strong>Date:</strong> {exercise.date} <br />
                                                <strong>Description:</strong> {exercise.description}
                                            </Card.Text>);
                                    })}
                                    <Button variant="primary" size="sm" as={Link} to={`/profile/${trainee.id}`}>
                                        View Profile
                                    </Button>
                                </Card.Body>
                            </Card>
                        );
                    })
                )}
            </Card.Body>
        </Card>
    </Container>
);
};

export default TraineesPage;