import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, logoutUser } from '../auth'; // Import logoutUser function instead of logout
import '../styles/main.css';
import NavItem from './NavItem'; // Adjust the path to the correct location of NavItem component

// Description: This component provides a navigation bar for the Fit & Meet application.
const NavBar = () => {
    const [logged] = useAuth(); // Assuming `useAuth` returns the user's authentication status
    const [permissions, setPermissions] = useState(null); // State to store user permissions

    useEffect(() => {
        if (logged) {
            const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

            if (!token) {
                logoutUser();
            }

            // Fetch user permissions.
            fetch('/auth/get-permissions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(token)}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch user permissions');
                    }
                    return response.json();
                })
                .then(data => {
                    // Set permissions in the state.
                    setPermissions(data.permissions);
                })
                .catch(error => {
                    console.error('Fetch permissions error:', error);
                });
        }
    });

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src="images/logo_74x13.png" alt="Fit & Meet logo" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {logged ? (
                            <>
                                <NavItem to="/profile">Profile</NavItem>

                                {permissions && permissions === 'trainee' &&
                                    <>
                                    <NavItem to="/exercises">Exercises History</NavItem>
                                    <NavItem to="/trainers">Trainers</NavItem>
                                    </>
                                }

                                {permissions && permissions === 'trainer' &&
                                    <>
                                    <NavItem to="/create_exercise">Add Exercise</NavItem>
                                    <NavItem to="/trainees">Trainees</NavItem>
                                    </>
                                }
                                <NavItem onClick={logoutUser}>Log Out</NavItem> {/* Call logoutUser function */}
                            </>
                        ) : (
                            <>
                                <NavItem to="/login">Login</NavItem>
                                <NavItem to="/signup">Sign Up</NavItem>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
