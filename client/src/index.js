// Import necessary CSS and libraries
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import './styles/navbar_footer.css';
import './styles/signup_login.css';

// Import necessary React libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Import necessary components
import NavBar from './components/Navbar'; // Import the Navbar component
import Footer from './components/Footer'; // Import the Footer component

// Import necessary pages
import HomePage from './components/Home'; // Import the HomePage component
import SignUpPage from './components/Auth/SignUp'; // Import the SignUpPage component
import LoginPage from './components/Auth/Login'; // Import the LoginPage component
import AdminPage from './components/Admin/Navigation'; // Import the AdminPage component
import Profile from './components/Profile/Navigation'; // Import the Profile component
import ExercisePage from './components/Exercises/Navigation'; // Import the ExercisePage component
import TraineesPage from './components/Lists/Trainees'; // Import the TraineesPage component
import TrainersPage from './components/Lists/Trainers'; // Import the TrainersPage component

// Other pages
import NotFoundPage from './components/NotFound'; // Import the NotFoundPage component
import PrivacyPage from './components/Privacy'; // Import the PrivacyPage component
import TermsPage from './components/Terms'; // Import the TermsPage component

// App component that defines the structure of the application
const App = () => {
    return (
        <Router>
            <div className="min-vh-100 d-flex flex-column">
                <NavBar /> {/* Render the Navbar component */}

                { /* Define the routes for the application */ }
                <Switch>
                    { /* Login and Signup components */}
                    <Route path="/login">
                        <LoginPage /> {/* Render the LoginPage component when URL matches '/login' */}
                    </Route>
                    
                    <Route path="/signup">
                        <SignUpPage /> {/* Render the SignUpPage component when URL matches '/signup' */}
                    </Route>

                    { /* Profile components are rendered for multiple routes */}
                    <Route path="/profile">
                        <Profile /> {/* Render the Profile component when URL matches '/profile' */}
                    </Route>


                    { /* List of trainees and trainers components */}
                    <Route path="/trainees">
                        <TraineesPage /> {/* Render the traineesPage component when URL matches '/trainees' */}
                    </Route>

                    <Route path="/trainers">
                        <TrainersPage /> {/* Render the trainersPage component when URL matches '/trainers' */}
                    </Route>


                    { /* Exercise components are rendered for multiple routes */}
                    <Route path="/exercises">
                        <ExercisePage /> {/* Render the ExercisePage component when URL matches '/exercises' */}
                    </Route>


                    { /* Admin components */}
                    <Route path="/admin">
                        <AdminPage /> {/* Render the AdminPage component when URL matches '/admin' */}
                    </Route>

                    { /* Privacy and Terms components */}
                    <Route path="/privacy">
                        <PrivacyPage /> {/* Render the PrivacyPage component when URL matches '/privacy' */}
                    </Route>

                    <Route path="/terms">
                        <TermsPage /> {/* Render the TermsPage component when URL matches '/terms' */}
                    </Route>

                    { /* Homepage component */}
                    <Route path="/" exact>
                        <HomePage /> {/* Render the HomePage component for the default route '/' */}
                    </Route>

                    { /* 404 page */}
                    <Route>
                        <NotFoundPage /> {/* Route for the 404 page */}
                    </Route>
                </Switch>
                { /* End of routes */ }

                <Footer /> {/* Render the Footer component */}
            </div>
        </Router>
    );
};

// Render the entire application
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root') // Render the app in the 'root' element of the HTML
);
