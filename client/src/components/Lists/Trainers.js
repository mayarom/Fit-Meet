import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Container, Row, Card, Button } from 'react-bootstrap';
import '../../styles/trainers_trainees.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const TrainersPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        document.title = 'Fit & Meet | Trainers';
        fetch('/lists/trainers-list', {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('REACT_TOKEN_AUTH_KEY')}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch trainers data, status code: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setTrainers(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Fetch trainers data error:', error);
                setError(`Failed to fetch trainers data: ${error.toString()}`);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <Container fluid="md"><Alert variant="info">Loading trainers data...</Alert></Container>;
    }

    if (error) {
        return <Container fluid="md"><Alert variant="danger">{error}</Alert></Container>;
    }

    return (
        <div className="auth-form-container">
            <Row>
                <h1 className="profile-title text-center">Meet Our Trainers</h1>
                <div className="grid-container">
                    {trainers.length > 0 ? (
                        trainers.map((trainer, index) => (
                            <Card key={index} className="custom-card">
                                <Card.Body className="trainer-card-body">
                                    <Card.Title>{trainer.name}</Card.Title>
                                    <Card.Text>
                                        <p>Experience: {trainer.experience}</p>
                                        <p>City: {trainer.city}</p>
                                        <p>Email: {trainer.email}</p>
                                        <p>Phone: {trainer.phone}</p>
                                    </Card.Text>
                                </Card.Body>
                                <div className="trainer-card-footer">
                                    <Button variant="primary" as={Link} to={`/profile/${trainer.id}`}>
                                        View Profile
                                    </Button>
                                    <Button variant="primary" href={trainer.paylink} target="_blank">
                                        Pay Here
                                    </Button>
                                    <Button variant="primary" as={Link} to={`/exercises/list/${trainer.id}`}>
                                        Exercises List
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center">No trainers found.</p>
                    )}
                </div>
            </Row>
        </div>
    );

};
export default TrainersPage;
