import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/home.css';
import { useAuth } from '../auth'; // Assuming you have an authentication context

const LoggedinHome = () => {
    const [logged] = useAuth(); // Assuming `useAuth` returns the user's authentication status
const MyButton = ({to, variant, className, children}) => (
    <div className={`button-container ${className}`}>
        <Link to={to}>
            <Button variant={variant} className="my-btn">{children}</Button>
        </Link>
    </div>
);

return (
    <div className="home-container">
        <div className="welcome-message">
            <h1 className="heading">Welcome to Fit & Meet!</h1>
            <p className="p">Fit & Meet is a social platform for fitness enthusiasts that helps you connect with trainers<br /> 
              in your area and find workout routines that suit your needs.</p>
        </div>

        {logged ? (
            <div className="exercise-buttons">
                <MyButton to="/exercises" variant="primary" className="exercise-button">View registered exercises</MyButton>
            </div>
        ) : (
            <div className="login-register-buttons">
                <MyButton to="/login" variant="primary" className="login-button">Login</MyButton>
                <MyButton to="/signup" variant="primary" className="signup-button">Register</MyButton>
            </div>
        )}
    </div>
);
}

export default LoggedinHome;
