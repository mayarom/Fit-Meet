import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';

const UserDetail = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        fetch(`/api/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [userId]);

    const onSubmit = (data) => {
        fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                setUser(data);
                alert('Profile updated successfully');
                history.push('/admin');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6}>
                    <Card className="mt-5">
                        <Card.Body>
                            <Card.Title>User Details</Card.Title>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        defaultValue={user.username} 
                                        placeholder="Username" 
                                        {...register('username', { required: true })}
                                        isInvalid={!!errors.username}
                                    />
                                    {errors.username && <Alert variant="danger">Username is required</Alert>}
                                </Form.Group>

                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        defaultValue={user.email} 
                                        placeholder="Email" 
                                        {...register('email', { required: true })}
                                        isInvalid={!!errors.email}
                                    />
                                    {errors.email && <Alert variant="danger">Email is required</Alert>}
                                </Form.Group> 

                                {/* additional fields for profile details (address, phone number, etc.) */}

                                <Button variant="primary" type="submit" className="mt-3">Update</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default UserDetail;