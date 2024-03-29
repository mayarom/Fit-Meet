import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa'; // Import the star icon from react-icons/fa
import '../../styles/profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Beautiful star rating component
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars.push(<FaStar key={i} color="gold" />);
        } else {
            stars.push(<FaStar key={i} color="lightgray" />);
        }
    }
    return <>{stars}</>;
};

const ProfileComponent = () => {
    const [user, setUser] = useState({
        basic_details: {},
        contact_details: {},
        trainee_details: {},
        trainer_details: {},
        trainer_reviews: []
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        fetch('/profile/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }, []);

    if (isLoading) {
        console.log("Loading user data...");
        console.log("user data: ", user);

        return (
            <Container>
                <Row>
                    <h1 className="profile-title text-center">Your Profile</h1>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Loading...</Card.Title>
                                <Card.Text>
                                    <p>Loading your profile...</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    };

    return (
        <Container fluid> {/* Use 'fluid' to make the container span the entire width of the view */}
            <Row className="justify-content-center"> {/* Center align the content */}
                <h1 className="profile-title text-center">Your Profile</h1>
                <Col xs={12} md={8}>
                    <Card className="w-100 profile-card">
                        <Card.Body>
                            <Card.Title>Information</Card.Title>
                            <Card.Text>
                                <p>Username: <span className="data-field-bg">{user.basic_details.username}</span></p>
                                <p>Email: <span className="data-field-bg">{user.contact_details.email}</span></p>
                                <p>Date of Birth: <span className="data-field-bg">{user.basic_details.dob}</span></p>
                                <p>Phone: <span className="data-field-bg">{user.contact_details.phone}</span></p>
                                <p>City: <span className="data-field-bg">{user.basic_details.city}</span></p>
                                <p>You are a <span className="data-field-bg">{user.basic_details.permissions}</span>!</p>

                                {user.basic_details.permissions === "trainee" && (
                                    <>
                                        <p>Height: <span className="data-field-bg">{user.trainee_details.height} meters</span></p>
                                        <p>Weight: <span className="data-field-bg">{user.trainee_details.weight} kg</span></p>
                                        <p>Goal: <span className="data-field-bg">{user.trainee_details.goal}</span></p>
                                    </>
                                )}

                                {user.basic_details.permissions === "trainer" && (
                                    <>
                                        <p>Experience: <span className="data-field-bg">{user.trainer_details.experience}</span></p>
                                        <p>Paylink: <span className="data-field-bg"><a href={user.trainer_details.paylink} target="_blank" rel="noopener noreferrer">{user.trainer_details.paylink}</a></span></p>
                                    </>
                                )}

                                {user.basic_details.permissions !== "trainee" && user.basic_details.permissions !== "trainer" && user.basic_details.permissions !== "admin" && (
                                    <p>Invalid permissions</p>
                                )}
                            </Card.Text>

                        </Card.Body>

                        {user.basic_details.permissions === "trainer" && (
                            <Card.Body>
                                <Card.Title className="card-title text-center">Reviews</Card.Title>
                                {user.trainer_reviews && user.trainer_reviews.length > 0 ? (
                                    user.trainer_reviews.map(review => (
                                        <Card key={review.user_id} className="mb-2">
                                            <Card.Body>
                                                <Card.Title className="card-title">{review.username}'s Review</Card.Title>
                                                <Card.Text className="card-text">
                                                    <p>Rating: <StarRating rating={review.stars} /></p> {/* Display star rating */}
                                                    <p>{review.description}</p>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))
                                ) : (
                                    <p>No reviews yet!</p>
                                )}
                            </Card.Body>
                        )}

                        <div className="trainer-card-footer">
                            <Button variant="primary" href="/profile/edit">Edit Profile</Button>
                            <Button variant="primary" href="/profile/change-password">Change Password</Button>
                            <Button variant="primary" href="/profile/delete-account">Delete Account</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfileComponent; // Export the ProfileComponent