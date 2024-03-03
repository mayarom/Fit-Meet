// Import necessary libraries and components
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Alert, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import '../../styles/profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddReviewModal from './Review'; 

// Description: This component provides a user profile page for other users to view.
const UserProfileComponent = () => {
 const { userid } = useParams();

 const [user, setUser] = useState({
 message: "Loading user data...",
 success: false,
 basic_details: {},
 contact_details: {},
 trainee_details: {},
 trainer_details: {},
 trainer_reviews: []
 });

 const [isLoading, setIsLoading] = useState(true);
 const prevUserIdRef = useRef();

 useEffect(() => {
 document.title = 'Fit & Meet | User Profile';

 if (prevUserIdRef.current !== userid) {
 setIsLoading(true); // Start loading

 const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

 fetch(`/profile/profile/${userid}`, {
 method: 'GET',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${JSON.parse(token)}`
 }
 })
 .then(res => {
 if (!res.ok) {
 throw new Error('Network response was not ok');
 }
 return res.json();
 })
 .then(data => {
 console.log("User data:", data);
 setUser(data); // Assuming `user` state directly stores the response object
 setIsLoading(false); // Finish loading
 })
 .catch(err => {
 console.error('Error fetching user profile:', err);
 setIsLoading(false); // Finish loading with error
 });

 prevUserIdRef.current = userid; // Update previous userid
 }
 }, [userid]); // Only re-run effect if userid changes 

 const [showAddReviewModal, setShowAddReviewModal] = useState(false);

 const handleShowAddReviewModal = () => setShowAddReviewModal(true);
 const handleCloseAddReviewModal = () => setShowAddReviewModal(false);

 if (isLoading) {
 return (
 <Container>
 <Row>
 <h1 className="text-center">User Profile</h1>
 <Col>
 <Card>
 <Card.Body>
 <Card.Title>Loading...</Card.Title>
 <Card.Text>
 <p>Loading user profile...</p>
 </Card.Text>
 </Card.Body>
 </Card>
 </Col>
 </Row>
 </Container>
 );
 }

 else if (!user.success) {
 return (
 <Container>
 <Row>
 <h1 className="text-center">User Profile</h1>
 <Col>
 <Card>
 <Card.Body>
 <Card.Title>User not found</Card.Title>
 <Alert variant="danger">User not found</Alert>
 </Card.Body>
 <Card.Body className="text-center">
 <Button href="/profile">Back to Profile</Button>
 </Card.Body>
 </Card>
 </Col>
 </Row>
 </Container>
 );
 }
 return (
 <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
 <Row className="justify-content-center w-100">
 <Col xs={12} md={8} lg={6}>
 <Card className="w-100 profile-card">
 <Card.Body>
 <Card.Title>Information</Card.Title>
 <Card.Text>
 <p><strong>Email:</strong><span className="data-field-bg"> {user.contact_details.email}</span></p>
 <p><strong>Date of Birth:</strong><span className="data-field-bg"> {user.basic_details.dob}</span></p>
 <p><strong>Phone:</strong><span className="data-field-bg"> {user.contact_details.phone}</span></p>
 <p><strong>City:</strong> <span className="data-field-bg">{user.basic_details.city}</span></p>
 <p><strong>Status:</strong> <span className="data-field-bg">{user.basic_details.username} is a {user.basic_details.permissions}.</span></p>
 {user.basic_details.permissions === "trainee" &&
 <>
 <p><strong>Height:</strong> <span className="data-field-bg">{user.trainee_details.height} meters</span></p>

 <p><strong>Weight:</strong> <span className="data-field-bg"> {user.trainee_details.weight} kg</span></p>
 <p><strong>Goal:</strong> <span className="data-field-bg"> {user.trainee_details.goal}</span></p>
 </>
 }
 {user.basic_details.permissions === "trainer" &&
 <>
 <p><strong>Experience:</strong><span className="data-field-bg"> {user.trainer_details.experience}</span></p>
 <p>Paylink: <span className="data-field-bg"> <a href={user.trainer_details.paylink} target="_blank" rel="noopener noreferrer" className="paylink-text">{user.trainer_details.paylink}</a></span></p>
 </>
 }
 {user.basic_details.permissions === "admin" &&
 <>
 {/* Admin Information */}
 <p>Admin Information</p>
 </>
 }
 {user.basic_details.permissions !== "trainee" && user.basic_details.permissions !== "trainer" && user.basic_details.permissions !== "admin" &&
 <p>Invalid permissions</p>
 }
 </Card.Text>
 </Card.Body>

 {user.basic_details.permissions === "trainer" &&
 <Card.Body>
 <Card.Title className="card-title text-center">Reviews</Card.Title>
 {user.trainer_reviews && user.trainer_reviews.length > 0 ? (
 user.trainer_reviews.map(review => (
 <Card key={review.user_id} className="mb-2">
 <Card.Body>
 <Card.Title className="card-title">{review.description}</Card.Title>
 <Card.Text className="card-text">
 <p>{review.description}</p>
 <p>Rating: {review.stars}</p>
 </Card.Text>
 </Card.Body>
 </Card>
 ))
 ) : (
 <p>No reviews yet!</p>
 )}
 </Card.Body>
 }
 
 <div className="text-center mb-3">
 <Button variant="outline-primary" className="btn-outline-primary" onClick={() => window.history.back()}>
 Back
 </Button>
 {}
 <AddReviewModal show={showAddReviewModal} trainerId={user.trainer_details.trainer_id} handleClose={handleCloseAddReviewModal} onSubmit={(data) => { console.log(data); }} />
 </div>
 </Card>
 </Col>
 </Row>
 </Container>
 );

};

export default UserProfileComponent;