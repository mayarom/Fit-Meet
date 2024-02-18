import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch, useParams, Link, useHistory } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card, Table } from 'react-bootstrap';
import { get, useForm } from 'react-hook-form';
import { login, logoutUser } from '../auth';
import '../styles/main.css';

const AdminPage = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = 'Fit & Meet | Control Panel';

        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        if (!token) {
            console.log("User not logged in");
            setError("Access denied. Please log in to view this page.");
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
            if (data.permissions !== 'admin') {
                setError('You do not have permission to view this page');
            }
            setIsLoading(false);
        }).catch(error => {
            console.error('Fetch permissions error:', error);
            setError('Failed to fetch user permissions');
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <Container>
                <Alert variant="info">Fetching permissions...</Alert>
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
        <Router>
            <Switch>
                <Route exact path="/admin">
                    <AdminComponent />
                </Route>
                <Route path="/admin/list">
                    <AdminListComponent />
                </Route>
            </Switch>
        </Router>
    );
};

const AdminComponent = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Admin Control Panel</Card.Title>
                            <Card.Text>
                                Welcome to the admin control panel. From here, you can manage the users and exercises in the system.
                            </Card.Text>
                            <div className="text-center">
                                <Button variant="primary" href="/admin/list">View Users</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

const AdminListComponent = () => {
    const [users, setUsers] = useState([]);
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

        fetch('/auth/users-list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users data');
            }
            return response.json();
        }).then(data => {
            if (data.message) {
                setError(data.message);
                setIsLoading(false);
                return;
            }
            console.log('Users data:', data);
            setUsers(data);
            setIsLoading(false);
        }).catch(error => {
            console.error('Fetch users data error:', error);
            setError('Failed to fetch users data:' + error);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <Container>
                <Alert variant="info">Fetching users data...</Alert>
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
            <Card>
                <Card.Title className="text-center">Users List (Admin Control Panel)</Card.Title>
                <Card.Body>
                    <Card.Text className="text-center">
                        View the list of users in the system. <br />
                        <Alert variant="info">Click on a username to view the details of that user.</Alert>
                        <Alert variant="danger">This control panel is only for debugging purposes.</Alert>
                    </Card.Text>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>City</th>
                                <th>Date of Birth</th>
                                <th>Permissions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((usr, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{usr.id}</td>
                                        <td><Link to={`/profile/${usr.id}`}>{usr.name}</Link></td>
                                        <td>{usr.email ? usr.email : 'N/A'}</td>
                                        <td>{usr.phone ? usr.phone : 'N/A'}</td>
                                        <td>{usr.city ? usr.city : 'N/A'}</td>
                                        <td>{usr.dob ? 
                                            new Intl.DateTimeFormat('en-GB', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit'
                                            }).format(new Date(usr.dob)) :
                                        'N/A'}</td>
                                        <td>{usr.permissions ? usr.permissions : 'N/A'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AdminPage; // Export the AdminPage component