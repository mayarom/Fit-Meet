import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ProfilePage = () => {
    const [user, setUser] = useState({
        basic_details: {},
        contact_details: {},
        trainee_details: {},
        trainer_details: {},
        trainer_reviews: []
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        fetch('/auth/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser(data);
            setIsLoading(false);
        })
        .catch(err => console.log(err));
    }, []);

    if (isLoading) {
        console.log("Loading user data...");
        console.log("user data: ", user);

        return (
            <Container>
                <Row>
                    <h1 className="text-center">Your Profile</h1>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Loading...</Card.Title>
                                <Card.Text>
                                    <p>Loading your profile...</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    };

    return (
        
        <Container>
            <Row>
                <h1 className="text-center">Your Profile</h1>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Information</Card.Title>
                            <Card.Text>
                                <p>Username: {user.basic_details.username}</p>
                                <p>Email: {user.contact_details.email}</p>
                                <p>Date of Birth: {user.basic_details.dob}</p>
                                <p>Phone: {user.contact_details.phone}</p>
                                <p>City: {user.basic_details.city}</p>
                                <p>You are a {user.basic_details.permissions}!</p>
                                {user.basic_details.permissions === "trainee" ?
                                    <>
                                        <p>Height: {user.trainee_details.height}</p>
                                        <p>Weight: {user.trainee_details.weight}</p>
                                        <p>Goal: {user.trainee_details.goal}</p>
                                    </>
                                    : user.basic_details.permissions === "trainer" ?
                                        <>
                                            <p>Experience: {user.trainer_details.experience}</p>
                                            <p>Paylink: {user.trainer_details.paylink}</p>
                                        </>
                                        : user.basic_details.permissions === "admin" ?
                                            <>
                                                <p>Admin Information</p>
                                                {/* Add admin details here */}
                                            </>
                                            : <p>Invalid permissions</p>
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
