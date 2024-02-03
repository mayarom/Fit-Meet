import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import '../styles/LoggedOutHome.css';

// Define the ExerciseComponent here
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
            {/* Display Exercises */}
            <div className="container mt-5">
                <h1>List of Exercises:</h1>
                <div className="exercise-list">
                    {exercises.map((exercise, index) => (
                        <div key={index} className="exercise-item">
                            {/* Use the ExerciseComponent here */}
                            {/* Replace ExerciseComponent with the actual component */}
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
}

export default ExercisePage;
