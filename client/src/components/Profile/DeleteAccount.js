import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import '../../styles/profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Description: This component provides a delete account form for users to delete their account.
const DeleteAccountComponent = () => {
    const history = useHistory();
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        document.title = 'Fit & Meet | Delete Account';
    }, []);

    const deleteAccount = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        fetch('/profile/delete-account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('API Response Data:', data); // Debugging statement
                if (data.success) {
                    localStorage.removeItem('REACT_TOKEN_AUTH_KEY');
                    setSuccess(true);
                    setTimeout(() => {
                        history.push('/');
                    }, 3000);
                } else {
                    setError(true);
                }
            })
            .catch((error) => {
                console.error('Account deletion failed:', error);
                setError(true);
            });
    }

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100 profile-container">
            <Row className="w-100 justify-content-center">
                <h2 className="page-title">Delete Account</h2>
                {error && <Alert variant="danger">Account deletion failed. Please try again later.</Alert>}
                {success && <Alert variant="success">Account deleted successfully</Alert>}
                <Col xs={12} md={8} lg={6}>
                    <Card className="mx-auto" style={{ maxWidth: '500px' }}>
                        <Card.Body>
                            <Card.Title>Careful!</Card.Title>
                            <Card.Text>
                                <p>Are you sure you want to delete your account?</p>
                                <p>This action cannot be undone.</p>
                                <div className="d-flex">
                                    <Button variant="primary" type="submit" onClick={deleteAccount}>
                                        Delete Account
                                    </Button>

                                    <Button variant="primary" href="/profile">
                                        Cancel
                                    </Button>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DeleteAccountComponent; // Export the DeleteAccountComponent component