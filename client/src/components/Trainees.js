import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch, useParams, Link, useHistory } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card, Table } from 'react-bootstrap';
import { get, useForm } from 'react-hook-form';
import { login, logoutUser } from '../auth';
import '../styles/main.css';

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
                fetch('/lists/trainees-list', {
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
        <Container fluid="md">
            <Card>
                <Card.Title className="text-center">Trainees</Card.Title>
                <Card.Body>
                    <Card.Text className="text-center">
                        View all trainees that are registered to your exercises.
                    </Card.Text>
                </Card.Body>
            </Card>
            <Table responsive="sm" striped bordered hover variant>
                <thead>
                    <tr className="text-center align-middle">
                        <th>ID</th>
                        <th>Name</th>
                        <th>City</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Registered exercises</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className="text-center align-middle">
                    {trainees.map((trainee, index) => {
                        return (
                            <tr key={index}>
                                <td>{trainee.id}</td>
                                <td>{trainee.name}</td>
                                <td>{trainee.city}</td>
                                <td>{trainee.email}</td>
                                <td>{trainee.phone}</td>
                                <td>Test</td>
                                <td>
                                    <Button variant="primary" size="sm" as={Link} to={`/profile/${trainee.id}`}>
                                        View Profile
                                    </Button>
                                </td>
                            </tr>
                        );
                    })
                };
                </tbody>
            </Table>
        </Container>
    );
};

export default TraineesPage;