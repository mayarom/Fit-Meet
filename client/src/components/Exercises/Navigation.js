import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {  Alert, Container } from 'react-bootstrap';
import '../../styles/LoggedOutHome.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import all the exercise page components here
import ExercisePageMain from './Main';
import ExercisePageCreate from './Create';
import ExercisePageList from './List';
import ExercisePageDetails from './Details';
import ExercisePageEdit from './Edit';

const ExercisePage = () => {
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Fit & Meet | Exercises';

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
                <Route exact path="/exercises">
                    <ExercisePageMain /> {/* Main exercise page, shows all exercises related to the user: registered exercises for trainees, and trainer's exercises for trainers */}
                </Route>

                <Route path="/exercises/create">
                    <ExercisePageCreate /> {/* Create exercise page, only available to trainers */}
                </Route>

                <Route path="/exercises/list/:userid">
                    <ExercisePageList /> {/* List of exercises for a specific trainer */}
                </Route>

                <Route path="/exercises/details/:exerciseId"> {/* Details of a specific exercise */}
                    <ExercisePageDetails />
                </Route>

                <Route path="/exercises/edit/:exerciseId"> {/* Edit a specific exercise */}
                    <ExercisePageEdit />
                </Route>
            </Switch>
        </Router>
    );
};

/* // Define the ExerciseComponent here
const ExerciseComponent = ({ title, date, description, onClick, onDelete }) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{date}</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <Button variant="primary" onClick={onClick}>Edit</Button>
                <Button variant="danger" onClick={onDelete}>Delete</Button>
            </Card.Body>
        </Card>
    );
} // <-- Add this closing brace
 
const ExercisePage = () => {
    const [exercises, setExercises] = useState([]);
    const [show, setShow] = useState(false);
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm();
    const [exerciseId, setExerciseId] = useState(0);
 
    useEffect(() => {
        fetch('/exercise/exercises')
            .then(res => res.json())
            .then(data => {
                setExercises(data);
            })
            .catch(err => console.log(err));
    }, []);
 
    const closeModal = () => {
        setShow(false);
    }
 
    const showModal = (id) => {
        setShow(true);
        setExerciseId(id);
        exercises.forEach((exercise) => {
            if (exercise.id === id) {
                setValue('title', exercise.title);
                setValue('description', exercise.description);
            }
        });
    }
 
    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
 
    const updateExercise = (data) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(data)
        };
 
        fetch(`/exercise/exercise/${exerciseId}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                const reload = window.location.reload();
                reload();
            })
            .catch(err => console.log(err));
    }
 
    const deleteExercise = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        };
 
        fetch(`/exercise/exercise/${id}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                // Update the exercises state after deleting
                setExercises(prevExercises => prevExercises.filter(exercise => exercise.id !== id));
            })
            .catch(err => console.log(err));
    }
 
    return (
        <div>
            { Display Exercises }
            <div className="container mt-5">
                <h1>List of Exercises:</h1>
                <div className="exercise-list">
                    {exercises.map((exercise, index) => (
                        <div key={index} className="exercise-item">
                            { Use the ExerciseComponent here }
                            { Replace ExerciseComponent with the actual component }
                            <ExerciseComponent
                                title={exercise.title}
                                date={exercise.date}
                                description={exercise.description}
                                onClick={() => showModal(exercise.id)}
                                onDelete={() => deleteExercise(exercise.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} */

export default ExercisePage;
