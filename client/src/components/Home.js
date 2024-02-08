import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/main.css';
import { useAuth } from '../auth'; // Assuming you have an authentication context

const LoggedinHome = () => {
    const [logged] = useAuth(); // Assuming `useAuth` returns the user's authentication status
    return (
        // Use "home-container" class to apply centering styles
        <div className="home-container">
            <div className="welcome-message">
                <h1 className="heading">Welcome to Fit & Meet!</h1>
                <p className="p">Fit & Meet is a social platform for fitness enthusiasts that helps you connect with trainers<br />
                                in your area and find workout routines that suit your needs.</p>
            </div>

            {logged ? (
                <div className="exercise-buttons">
                    <Link to="/exercises">
                        <Button variant="primary">View registered exercises</Button>
                    </Link>
                </div>
            ) : (
                <div className="login-register-buttons">
                    <Link to="/login">
                        <Button variant="primary">Login</Button>
                    </Link>
                    <Link to="/signup">
                        <Button variant="success">Register</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default LoggedinHome;
