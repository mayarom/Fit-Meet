// Import necessary CSS and libraries
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import './styles/navbar_footer.css';
import './styles/home.css';
import './styles/signup_login.css';
import './styles/home.css';
import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './components/Home'; // Import the HomePage component
import SignUpPage from './components/SignUp'; // Import the SignUpPage component
import LoginPage from './components/Login'; // Import the LoginPage component
import CreateExercisePage from './components/CreateExercise'; // Import the CreateExercisePage component
import Profile from './components/Profile'; // Import the Profile component
import ExercisePage from './components/Exercise'; // Import the ExercisePage component
import TraineesPage from './components/Trainees'; // Import the TraineesPage component
import AdminPage from './components/Admin'; // Import the AdminPage component
import TrainersPage from './components/Trainers';
//footer
import Footer from './components/Footer';

// App component that defines the structure of the application
const App = () => {
    return (
        <Router>
            <div className="min-vh-100 d-flex flex-column">
                <NavBar/> {/* Render the Navbar component */}
               
                <Switch>
                    <Route path="/profile">
                        <Profile/> {/* Render the Profile component when URL matches '/profile' */}
                    </Route>
                    <Route path="/change-password">
                        <Profile/> {/* Render the Profile component when URL matches '/change-password' */}
                    </Route>
                    <Route path="/edit-profile">
                        <Profile/> {/* Render the Profile component when URL matches '/edit-profile' */}
                    </Route>
                    <Route path="/delete-account">
                        <Profile/> {/* Render the Profile component when URL matches '/delete-account' */}
                    </Route>
                    <Route path="/profile/:userid">
                        <Profile/> {/* Render the Profile component when URL matches '/profile/:userid' */}
                    </Route>
                    <Route path="/create_exercise">
                        <CreateExercisePage/> {/* Render the CreateExercisePage component when URL matches '/create_exercise' */}
                    </Route>
                    <Route path="/login">
                        <LoginPage/> {/* Render the LoginPage component when URL matches '/login' */}
                    </Route>
                    <Route path="/signup">
                        <SignUpPage/> {/* Render the SignUpPage component when URL matches '/signup' */}
                    </Route>    
                    <Route path="/exercises">
                        <ExercisePage/> {/* Render the ExercisePage component when URL matches '/exercises' */}
                    </Route>
                    <Route path="/trainees">
                        <TraineesPage/> {/* Render the traineesPage component when URL matches '/trainees' */}
                    </Route>
                    <Route path="/trainers">
                        <TrainersPage/> {/* Render the trainersPage component when URL matches '/trainers' */}
                    </Route>
                    <Route path="/admin">
                        <AdminPage/> {/* Render the AdminPage component when URL matches '/admin' */}
                    </Route>
                    <Route path="/admin/list">
                        <AdminPage/> {/* Render the AdminPage component when URL matches '/admin/list' */}
                    </Route>
                    <Route path="/">
                        <HomePage/> {/* Render the HomePage component for the default route '/' */}
                    </Route>
                </Switch>
                 <Footer/>
            </div>
        </Router>
    );
};

// Render the entire application
ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root') // Render the app in the 'root' element of the HTML
);
