import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Alert, Container, Card, Table } from 'react-bootstrap';
import '../../styles/admin.css';

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

        fetch('/lists/users-list', {
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
        <Container fluid className="admin-container">
            <h1 className="admin-header">Users List (Admin Panel)</h1>
            <Card.Body>
                <Alert variant="primary">Click on a username to view the details of that user.</Alert>
                <Alert variant="danger">This control panel is only for debugging purposes.</Alert>
                <Card.Text className="text-center">
                    View the list of users in the system.
                </Card.Text>
                <Table className="admin-table" striped bordered hover>
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

                <div className="text-center">
                    <Button variant="primary" href="/admin">Back to Admin Panel</Button>
                </div>
            </Card.Body>
        </Container>
    );
}

export default AdminListComponent; // Export the AdminPage component