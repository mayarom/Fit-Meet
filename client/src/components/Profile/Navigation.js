import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Alert, Container } from 'react-bootstrap';
import '../../styles/profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import all the profile page components here
import ProfileComponent from './Main'; // Main profile page
import EditProfileComponent from './Edit'; // Edit profile page
import ChangePasswordComponent from './ChangePassword'; // Change password page
import DeleteAccountComponent from './DeleteAccount'; // Delete account page
import UserProfileComponent from './View'; // View user profile page (view other users' profiles)

const ProfilePage = () => {
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Fit & Meet | Profile';

        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        if (!token) {
            console.log("User not logged in");
            setError("Access denied. Please log in to view this page.");
            return;
        }
    }, []);

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
                <Route exact path="/profile">
                    <ProfileComponent />
                </Route>
                <Route path="/profile/edit">
                    <EditProfileComponent />
                </Route>
                <Route path="/profile/change-password">
                    <ChangePasswordComponent />
                </Route>
                <Route path="/profile/delete-account">
                    <DeleteAccountComponent />
                </Route>
                <Route path="/profile/:userid">
                    <UserProfileComponent />
                </Route>
            </Switch>
        </Router>
    );
};

export default ProfilePage; // Export the ProfilePage component