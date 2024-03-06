import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Alert, Container } from 'react-bootstrap';
import AdminComponent from './Menu';
import AdminListComponent from './UsersList';
import AdminExercisesComponent from './ExercisesList';
import '../../styles/admin.css';

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
                <Route path="/admin/exercises">
                    <AdminExercisesComponent />
                </Route>
            </Switch>
        </Router>
    );
};

export default AdminPage; // Export the AdminPage component