import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddReviewModal = ({ trainerId, userId, onSubmit }) => {
    const [show, setShow] = useState(false);
    const [reviewStars, setReviewStars] = useState(1);
    const [reviewDescription, setReviewDescription] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/review/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY'))}`
            },
            body: JSON.stringify({ trainer_id: trainerId, user_id: userId, stars: reviewStars, description: reviewDescription })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add review');
                }
                return response.json();
            })
            .then(data => {
                console.log('Review added:', data);
                handleClose();
                
                // Refresh the page
                window.location.reload();
            })
            .catch(error => {
                console.error('Error adding review:', error);
            });
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add Review
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="reviewStars">
                            <Form.Label>Stars (1-5):</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="5"
                                value={reviewStars}
                                onChange={(e) => setReviewStars(parseInt(e.target.value))}
                            />
                        </Form.Group>
                        <Form.Group controlId="reviewDescription">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={reviewDescription}
                                onChange={(e) => setReviewDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddReviewModal;
