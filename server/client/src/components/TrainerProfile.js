// TrainerProfile.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TrainerProfile = () => {
    const { trainerId } = useParams();
    const [trainer, setTrainer] = useState({});
    const [exercises, setExercises] = useState([]);
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        // Fetch trainer's details from your API based on trainerId
        // Example API call:
        fetch(`/api/trainers/${trainerId}`)
            .then((response) => response.json())
            .then((data) => setTrainer(data.trainer))
            .catch((error) => console.error('Error fetching trainer details:', error));

        // Fetch trainer's exercises from your API based on trainerId
        // Example API call:
        fetch(`/api/trainers/${trainerId}/exercises`)
            .then((response) => response.json())
            .then((data) => setExercises(data.exercises))
            .catch((error) => console.error('Error fetching trainer exercises:', error));

        // Fetch trainer's grades from your API based on trainerId
        // Example API call:
        fetch(`/api/trainers/${trainerId}/grades`)
            .then((response) => response.json())
            .then((data) => setGrades(data.grades))
            .catch((error) => console.error('Error fetching trainer grades:', error));
    }, [trainerId]);

    return (
        <div>
            <h1>Trainer Profile: {trainer.name}</h1>
            
            <h2>Exercises:</h2>
            <ul>
                {exercises.map((exercise) => (
                    <li key={exercise.id}>{exercise.name}</li>
                ))}
            </ul>

            <h2>Grades:</h2>
            <ul>
                {grades.map((grade) => (
                    <li key={grade.id}>{grade.stars} stars - {grade.description}</li>
                ))}
            </ul>
        </div>
    );
};

export default TrainerProfile;
