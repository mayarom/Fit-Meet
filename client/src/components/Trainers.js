// Trainers.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Trainers = () => {
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        // Fetch trainers data from your API and update the `trainers` state
        // Example API call:
        fetch('/api/trainers')
            .then((response) => response.json())
            .then((data) => setTrainers(data.trainers))
            .catch((error) => console.error('Error fetching trainers:', error));
    }, []);

    return (
        <div>
            <h1>Trainers</h1>
            <ul>
                {trainers.map((trainer) => (
                    <li key={trainer.id}>
                        <Link to={`/trainers/${trainer.id}`}>{trainer.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Trainers;
