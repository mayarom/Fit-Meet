import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, logout } from '../auth'; // Assuming you have an authentication context
import '../styles/main.css';
import NavItem from './NavItem'; // Adjust the path to the correct location of NavItem component

// Description: This component provides a navigation bar for the Fit & Meet application.
const NavBar = () => {
    const [logged] = useAuth(); // Assuming `useAuth` returns the user's authentication status

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Fit&Meet
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
                                <NavItem to="/exercises">Exercises History</NavItem>
                                <NavItem to="/profile">Profile</NavItem>
                                <NavItem to="/create_exercise">Add Exercises</NavItem>
                                <NavItem to="/trainers">Trainers</NavItem> {/* Add this link to the Trainers page */}
                                <NavItem onClick={logout}>Log Out</NavItem>
                            </>
                        ) : (
                            <>
                                <NavItem to="/">Home</NavItem>
                                <NavItem to="/signup">Sign Up</NavItem>
                                <NavItem to="/login">Login</NavItem>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;



