import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/main.css';

const LoggedinHome = () => {
    return (
        // Use "home-container" class to apply centering styles
        <div className="home-container">
            <div className="welcome-message">
                <h1 className="heading">Welcome to Fit & Meet!</h1>
                <p className="p">Here you can create and track your exercises.</p>
            </div>

            <div className="login-register-buttons">
                <Link to="/login">
                    <Button variant="primary">Login</Button>
                </Link>
                <Link to="/register">
                    <Button variant="success">Register</Button>
                </Link>
            </div>
        </div>
    );
}

export default LoggedinHome;
