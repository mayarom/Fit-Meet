import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch, useParams, Link, useHistory } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { login } from '../auth';
import '../styles/main.css';

const ProfilePage = () => {
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Fit & Meet | Profile';

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
                <Route exact path="/profile">
                    <ProfileComponent />
                </Route>
                <Route path="/edit-profile">
                    <EditProfileComponent />
                </Route>
                <Route path="/change-password">
                    <ChangePasswordComponent />
                </Route>
                <Route path="/delete-account">
                    <DeleteAccountComponent />
                </Route>
                <Route path="/profile/:userid">
                    <UserProfileComponent />
                </Route>
            </Switch>
        </Router>
    );
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

        fetch('/auth/profile', {
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
                    <h1 className="text-center">Your Profile</h1>
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
        <Container>
            <Row>
                <h1 className="text-center">Your Profile</h1>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Information</Card.Title>
                            <Card.Text>
                                <p>Username: {user.basic_details.username}</p>
                                <p>Email: {user.contact_details.email}</p>
                                <p>Date of Birth: {user.basic_details.dob}</p>
                                <p>Phone: {user.contact_details.phone}</p>
                                <p>City: {user.basic_details.city}</p>
                                <p>You are a {user.basic_details.permissions}!</p>
                                {user.basic_details.permissions === "trainee" ?
                                    <>
                                        <p>Height: {user.trainee_details.height} meters</p>
                                        <p>Weight: {user.trainee_details.weight} kg</p>
                                        <p>Goal: {user.trainee_details.goal}</p>
                                    </>
                                    : user.basic_details.permissions === "trainer" ?
                                        <>
                                            <p>Experience: {user.trainer_details.experience}</p>
                                            <p>Paylink: {user.trainer_details.paylink}</p>
                                        </>
                                        : user.basic_details.permissions === "admin" ?
                                            <>
                                                <p>Admin Information</p>
                                                {/* Add admin details here */}
                                            </>
                                            : <p>Invalid permissions</p>
                                }
                            </Card.Text>
                        </Card.Body>

                        {user.basic_details.permissions === "trainer" ?
                            <Card.Body>
                                <Card.Title>Reviews</Card.Title>
                                <Card.Text>
                                    {user.trainer_reviews != null ?
                                        user.trainer_reviews.map(review => {
                                            return (
                                                <Card key={review._id}>
                                                    <Card.Body>
                                                        <Card.Title>{review.title}</Card.Title>
                                                        <Card.Text>
                                                            <p>{review.body}</p>
                                                            <p>Rating: {review.rating}</p>
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            );
                                        })
                                        : <p>No reviews yet!</p>
                                    }
                                </Card.Text>
                            </Card.Body>
                            : null
                        }

                        <div className="text-center">
                            <Button href="/edit-profile">Edit Profile</Button>
                            <Button href="/change-password">Change Password</Button>
                            <Button href="/delete-account">Delete Account</Button>
                        </div>

                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

const EditProfileComponent = () => {
    return (
        <Container>
            <Row>
                <h1 className="text-center">Edit Profile</h1>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Edit Profile</Card.Title>
                            <Card.Text>
                                <Alert variant="info">This feature is coming soon!</Alert>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

// Description: This component provides a change password form for users to change their password.
const ChangePasswordComponent = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const history = useHistory();
    const [passwordError, setPasswordError] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // Description: Function to handle user password change.

    const changePassword = (data) => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify({ ...data })
        };

        fetch('/auth/change-password', requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log('API Response Data:', data); // Debugging statement
                if (data.success) {
                    setPasswordSuccess(true);
                    setTimeout(() => {
                        history.push('/profile');
                    }, 3000);
                } else {
                    setPasswordError(true);
                }
            })
            .catch((error) => {
                console.error('Password change failed:', error);
                setPasswordError(true);
            });

        reset();
    }

    return (
        <div className="container mt-5">
            <h2 as={Col} md="6" className="mb-3 text-center">Change Password</h2>
            {passwordError && <Alert variant="danger">Invalid password</Alert>}
            {passwordSuccess && <Alert variant="success">Password changed successfully</Alert>}
            <form onSubmit={handleSubmit(changePassword)}>
                <Form.Group controlId="formOldPassword">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Your old password"
                        {...register('old_password', { required: true, maxLength: 25 })}
                        isInvalid={!!errors.old_password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.old_password && errors.old_password.type === "required" && <p>This field is required</p>}
                        {errors.old_password && errors.old_password.type === "maxLength" && <p>Password cannot exceed 25 characters</p>}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Your new password"
                        {...register('new_password', { required: true, maxLength: 25 })}
                        isInvalid={!!errors.new_password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.new_password && errors.new_password.type === "required" && <p>This field is required</p>}
                        {errors.new_password && errors.new_password.type === "maxLength" && <p>Password cannot exceed 25 characters</p>}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Change Password
                </Button>
            </form>
        </div>
    );
};

// Description: This component provides a delete account form for users to delete their account.
const DeleteAccountComponent = () => {
    return (
        <Container>
            <Row>
                <h1 className="text-center">Delete Account</h1>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <Alert variant="info">This feature is coming soon!</Alert>
                            </Card.Text>
                        </Card.Body>
                        <Card.Body>
                            <Card.Title>Careful!</Card.Title>
                            <Card.Text>
                                <p>Are you sure you want to delete your account?</p>
                                <p>This action cannot be undone.</p>
                                <Button variant="danger">Delete Account</Button>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

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
        if (prevUserIdRef.current !== userid) {
            setIsLoading(true); // Start loading
    
            fetch(`/auth/profile/${userid}`)
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

    if (isLoading)
    {
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
    
    else if (!user.success)
    {
        return (
            <Container>
                <Row>
                    <h1 className="text-center">User Profile</h1>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>User not found</Card.Title>
                                <Card.Text>
                                    <p>User not found</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container>
            <Row>
                <h1 className="text-center">{user.basic_details.username}'s Profile</h1>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Information</Card.Title>
                            <Card.Text>
                                <p>Email: {user.contact_details.email}</p>
                                <p>Date of Birth: {user.basic_details.dob}</p>
                                <p>Phone: {user.contact_details.phone}</p>
                                <p>City: {user.basic_details.city}</p>
                                <p>{user.basic_details.username} is a {user.basic_details.permissions}!</p>
                                {user.basic_details.permissions === "trainee" ?
                                    <>
                                        <p>Height: {user.trainee_details.height} meters</p>
                                        <p>Weight: {user.trainee_details.weight} kg</p>
                                        <p>Goal: {user.trainee_details.goal}</p>
                                    </>
                                    : user.basic_details.permissions === "trainer" ?
                                        <>
                                            <p>Experience: {user.trainer_details.experience}</p>
                                            <p>Paylink: {user.trainer_details.paylink}</p>
                                        </>
                                        : user.basic_details.permissions === "admin" ?
                                            <>
                                                <p>Admin Information</p>
                                                {/* Add admin details here */}
                                            </>
                                            : <p>Invalid permissions</p>
                                }
                            </Card.Text>
                        </Card.Body>

                        {user.basic_details.permissions === "trainer" ?
                            <Card.Body>
                                <Card.Title>Reviews</Card.Title>
                                <Card.Text>
                                    {user.trainer_reviews != null ?
                                        user.trainer_reviews.map(review => {
                                            return (
                                                <Card key={review._id}>
                                                    <Card.Body>
                                                        <Card.Title>{review.title}</Card.Title>
                                                        <Card.Text>
                                                            <p>{review.body}</p>
                                                            <p>Rating: {review.rating}</p>
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            );
                                        })
                                        : <p>No reviews yet!</p>
                                    }
                                </Card.Text>
                            </Card.Body>
                            : null
                        }
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;