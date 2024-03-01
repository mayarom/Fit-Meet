import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const TrainerExercises = () => {
    const [trainerExercises, setTrainerExercises] = useState([]);
    const { name } = useParams();
    useEffect(() => {
        fetch(`/exercise/trainer_exercises/${name}`)
            .then(res => res.json())
            .then(data => {
                setTrainerExercises(data);
            })
            .catch(err => console.log(err));
    }, [name]);

    return (
        <div>
            <h1>Exercises added by Trainer {name}:</h1>
            <div className="exercise-list">
                {trainerExercises.map((exercise, index) => (
                    <div key={index} className="exercise-item">
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>{exercise.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{exercise.date}</Card.Subtitle>
                                <Card.Text>{exercise.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrainerExercises;