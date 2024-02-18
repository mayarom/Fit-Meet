import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch, useParams, Link, useHistory } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { login, logoutUser } from '../auth';
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
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const history = useHistory();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [user, setUser] = useState({
        basic_details: {},
        contact_details: {},
        trainee_details: {},
        trainer_details: {},
        trainer_reviews: []
    });

    const [isLoading, setIsLoading] = useState(true);

    // List of cities in Israel
    // TODO: Add more cities
    // TODO: Move this list to a separate file and import it here
    // TODO: Use the list to populate the city dropdown
    const cities = [
        "Acre", "Arad", "Ariel", "Ashdod", "Ashkelon", 
        "Bat Yam", "Beersheba", "Beit Shemesh", "Beit She'an", "Bnei Brak", 
        "Dimona", 
        "Eilat", 
        "Giv'atayim", 
        "Hadera", "Haifa", "Herzliya", "Hod HaSharon", "Holon", 
        "Jerusalem", 
        "Karmiel", "Kfar Saba", "Kiryat Ata", "Kiryat Bialik", "Kiryat Gat", "Kiryat Malakhi", "Kiryat Motzkin", "Kiryat Ono", "Kiryat Shmona", "Kiryat Yam", 
        "Lod", 
        "Ma'ale Adumim", "Migdal HaEmek", "Modi'in-Maccabim-Re'ut", "Modi'in Illit", "Nahariya", "Nazareth", "Nazareth Illit", "Nesher", "Ness Ziona", "Netanya", "Netivot", 
        "Ofakim", "Or Akiva", 
        "Petah Tikva", 
        "Ra'anana", "Rahat", "Ramat Gan", "Ramat HaSharon", "Ramla", "Rehovot", "Rishon LeZion", "Rosh HaAyin", 
        "Safed", "Sderot", 
        "Tel Aviv", "Tiberias", "Tira", "Tzfat", 
        "Yavne", "Yokneam" 
    ]

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

    const editProfile = (data) => {
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify({ ...data })
        };

        fetch('/auth/edit-profile', requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log('API Response Data:', data); // Debugging statement
                if (data.success) {
                    setSuccess(true);
                    setTimeout(() => {
                        history.push('/profile');
                    }, 3000);
                } else {
                    setError(data.message);
                }
            })
            .catch((error) => {
                console.error('Profile edit failed:', error);
                setError("Profile edit failed. Please try again later.");
            });
    };
    

    if (isLoading) {
        console.log("Loading user data...");
        console.log("user data: ", user);

        return (
            <Container>
                <Row>
                    <h1 className="text-center">Edit Profile</h1>
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
    }

    return (
        <Container>
            <Row>
                <h1 className="text-center">Edit Profile</h1>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Edit Profile</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">Profile updated successfully</Alert>}
                            <Form onSubmit={handleSubmit(editProfile)}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Your email"
                                        defaultValue={user.contact_details.email}
                                        {...register('email', { required: true, maxLength: 255 })}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email && errors.email.type === "required" && <p>This field is required</p>}
                                        {errors.email && errors.email.type === "maxLength" && <p>Email cannot exceed 255 characters</p>}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formDob">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        defaultValue={user.basic_details.dob}
                                        {...register("dob", {
                                            required: "Date of Birth is required.",
                                            validate: value => {
                                                const currentDate = new Date();
                                                const dob = new Date(value);
                                                const minDate = new Date(currentDate.getFullYear() - 100, 0, 1);
                                                const maxDate = new Date(currentDate.getFullYear() - 18, 0, 1);
            
                                                return dob >= minDate && dob <= maxDate || "You must be between 18 and 100 years old.";
                                            }
                                        })}
                                        min={(new Date()).getFullYear() - 100 + "-01-01"} // Calculate the minimum allowed date dynamically
                                        max={(new Date()).getFullYear() - 18 + "-12-31"} // Calculate the maximum allowed date dynamically
                                        isInvalid={!!errors.dob}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.dob && errors.dob.type === "required" && <p>This field is required</p>}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formPhone">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Your phone number"
                                        onKeyDown={(e) => {
                                            const maxLength = 10;
                                            const currentValueLength = e.target.value.length;
                                            // Allow only numeric keys, backspace, delete, arrow keys, and navigation keys
                                            if (
                                                (!/^\d$/.test(e.key) && // Allow only numeric keys
                                                !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) ||
                                                (currentValueLength >= maxLength && !["Backspace", "Delete"].includes(e.key))
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                        defaultValue={user.contact_details.phone}
                                        {...register("phone", {
                                            required: true,
                                            pattern: {
                                                value: /^\d{10}$/,
                                                message: "Please enter a valid 10-digit phone number containing only numbers.",
                                            },
                                        })}
                                        isInvalid={!!errors.phone}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone && errors.phone.type === "required" && <p>This field is required</p>}
                                        {errors.phone && errors.phone.type === "maxLength" && <p>Phone number cannot exceed 10 characters</p>}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formCity">
                                    <Form.Label>City</Form.Label>
                                    <Form.Select 
                                        defaultValue={user.basic_details.city}
                                        {...register('city', { required: true })}
                                        isInvalid={!!errors.city}
                                    >
                                        <option value="" disabled>Select your city</option> {/* Placeholder */}
                                        {cities.map((city, index) => (
                                            <option key={index} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.city && <p>This field is required</p>}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* Add some spacing between the two Form.Groups */}
                                <div className="mb-3"></div>

                                {user.basic_details.permissions === "trainee" ?
                                    <>
                                    <Form.Group controlId="formTraineeGoals">
                                        <Form.Label>Goal</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Your goal"
                                            defaultValue={user.trainee_details.goal}
                                            {...register('goal', { required: true, maxLength: 50 })}
                                            isInvalid={!!errors.goal} />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.goal && errors.goal.type === "required" && <p>This field is required</p>}
                                            {errors.goal && errors.goal.type === "maxLength" && <p>Goal cannot exceed 50 characters</p>}
                                        </Form.Control.Feedback>
                                    </Form.Group><Form.Group controlId="formTraineeHeight">                                        
                                            <Form.Label>Height</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Your height"
                                                defaultValue={user.trainee_details.height}
                                                {...register('height', { required: true, min: 1.0, max: 2.50 })}
                                                isInvalid={!!errors.height} 
                                                step="0.01"
                                                onKeyDown={(e) => {
                                                    const currentValue = parseFloat(e.target.value);
                                                    const minValue = 1.0;
                                                    const maxValue = 2.50;
                                                    const step = 0.01;
                                                    
                                                    if (e.key === "ArrowUp" && currentValue + step <= maxValue) {
                                                        e.target.value = (currentValue + step).toFixed(2);
                                                    } else if (e.key === "ArrowDown" && currentValue - step >= minValue) {
                                                        e.target.value = (currentValue - step).toFixed(2);
                                                    }
                                                }}
                                                />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.height && errors.height.type === "required" && <p>This field is required</p>}
                                                {errors.height && errors.height.type === "min" && <p>Height cannot be less than 1 meter</p>}
                                                {errors.height && errors.height.type === "max" && <p>Height cannot exceed 3 meters</p>}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="formTraineeWeight">
                                            <Form.Label>Weight</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Your weight"
                                                defaultValue={user.trainee_details.weight}
                                                {...register('weight', { required: true, min: 40.0, max: 300.0 })}
                                                isInvalid={!!errors.weight} 
                                                step="0.1"
                                                onKeyDown={(e) => {
                                                    const currentValue = parseFloat(e.target.value);
                                                    const minValue = 40.0;
                                                    const maxValue = 300.0;
                                                    const step = 0.1;
                                                    
                                                    if (e.key === "ArrowUp" && currentValue + step <= maxValue) {
                                                        e.target.value = (currentValue + step).toFixed(2);
                                                    } else if (e.key === "ArrowDown" && currentValue - step >= minValue) {
                                                        e.target.value = (currentValue - step).toFixed(2);
                                                    }
                                                }}
                                                />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.weight && errors.weight.type === "required" && <p>This field is required</p>}
                                                {errors.weight && errors.weight.type === "min" && <p>Weight cannot be less than 40 kg</p>}
                                                {errors.weight && errors.weight.type === "max" && <p>Weight cannot exceed 300 kg</p>}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </>
                                    : user.basic_details.permissions === "trainer" ?
                                        <>
                                        <Form.Group controlId="formTrainerExperience">
                                            <Form.Label>Trainer Details</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Your experience"
                                                defaultValue={user.trainer_details.experience}
                                                {...register('experience', { required: true, maxLength: 50 })}
                                                isInvalid={!!errors.experience}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.experience && errors.experience.type === "required" && <p>This field is required</p>}
                                                {errors.experience && errors.experience.type === "maxLength" && <p>Experience cannot exceed 50 characters</p>}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="formTrainerPaylink">
                                            <Form.Label>Paylink</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Your paylink"
                                                defaultValue={user.trainer_details.paylink}
                                                {...register('paylink', { required: true, maxLength: 50 })}
                                                isInvalid={!!errors.paylink}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.paylink && errors.paylink.type === "required" && <p>This field is required</p>}
                                                {errors.paylink && errors.paylink.type === "maxLength" && <p>Paylink cannot exceed 50 characters</p>}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        </>: null
                                }
                                <div className="text-center">
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <Button variant="primary" type="submit">
                                            Update Profile
                                        </Button>

                                        <Button variant="secondary" onClick={() => reset()}>
                                            Reset
                                        </Button>

                                        <Button variant="danger" onClick={() => history.push('/profile')}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </Form>
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
    const [error, setError] = useState(null);

    // Description: Function to handle user password change.

    const changePassword = (data) => {
        if (data.new_password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (data.new_password === data.old_password) {
            setError("New password cannot be the same as the old password.");
            return;
        }
        
        if (data.new_password === data.confirm_password) {
            const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
            setError(null);
            const requestBody = {
                ...data
            };

            delete requestBody.confirm_password;

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(token)}`
                },
                body: JSON.stringify(requestBody)
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
                        setError(null);
                    }
                })
                .catch((error) => {
                    console.error('Password change failed:', error);
                    setPasswordError(false);
                    setError("Server failure: " + error);
                });
    
            reset();
        } else {
            setError("Passwords do not match, please try again.");
            return;
        }
    }

    return (
        <div className="container mt-5">
            <h2 as={Col} md="6" className="mb-3 text-center">Change Password</h2>
            {passwordError && <Alert variant="danger">Invalid password</Alert>}
            {passwordSuccess && <Alert variant="success">Password changed successfully</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
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
                <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control

                        type="password"
                        placeholder="Confirm your new password"
                        {...register('confirm_password', { required: true, maxLength: 25 })}
                        isInvalid={!!errors.confirm_password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.confirm_password && errors.confirm_password.type === "required" && <p>This field is required</p>}
                        {errors.confirm_password && errors.confirm_password.type === "maxLength" && <p>Password cannot exceed 25 characters</p>}
                    </Form.Control.Feedback>
                </Form.Group>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Button variant="primary" type="submit">
                        Change Password
                    </Button>

                    <Button variant="secondary" onClick={() => reset()}>
                        Reset
                    </Button>

                    <Button variant="danger" onClick={() => history.push('/profile')}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

// Description: This component provides a delete account form for users to delete their account.
const DeleteAccountComponent = () => {
    const history = useHistory();
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        document.title = 'Fit & Meet | Delete Account';
    }, []);

    const deleteAccount = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

        fetch('/auth/delete-account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('API Response Data:', data); // Debugging statement
                if (data.success) {
                    localStorage.removeItem('REACT_TOKEN_AUTH_KEY');
                    setSuccess(true);
                    setTimeout(() => {
                        history.push('/');
                    }, 3000);
                } else {
                    setError(true);
                }
            })
            .catch((error) => {
                console.error('Account deletion failed:', error);
                setError(true);
            });
    }

    return (
        <Container>
            <Row>
                <h1 className="text-center">Delete Account</h1>
                {error && <Alert variant="danger">Account deletion failed. Please try again later.</Alert>}
                {success && <Alert variant="success">Account deleted successfully</Alert>}
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Careful!</Card.Title>
                            <Card.Text>
                                <p>Are you sure you want to delete your account?</p>
                                <p>This action cannot be undone.</p>
                                <div className="d-flex">
                                    <Button variant="danger" type="submit" onClick={deleteAccount}>
                                        Delete Account
                                    </Button>

                                    <Button variant="secondary" href="/profile">
                                        Cancel
                                    </Button>
                                </div>
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

            const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
            
            fetch(`/auth/profile/${userid}`, {
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

                        <div className="text-center">
                            <Button href="/profile">Back to Profile</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;