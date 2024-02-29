import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import '../../styles/profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        document.title = 'Fit & Meet | Edit Profile';

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

        fetch('/profile/edit-profile', requestOptions)
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
                <Row className="justify-content-center">
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
        <Container fluid className="d-flex justify-content-center align-items-center vh-100">
            <Row className="w-100 justify-content-center">
                <h2 className="page-title">Edit Profile</h2>
                <Col xs={12} md={8} lg={6}>
                    <Card className="mx-auto" style={{ maxWidth: '500px' }}>
                        <Card.Body>
                            <Card.Title>Edit Profile</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">Profile updated successfully</Alert>}
                            <Form onSubmit={handleSubmit(editProfile)}>
                                <Form.Group controlId="formEmail" >
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
                                <Form.Group controlId="formDob" >
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

                                                return ((dob >= minDate && dob <= maxDate) || "You must be between 18 and 100 years old.");
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
                                        </Form.Group><Form.Group controlId="formTraineeHeight" >
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
                                        <Form.Group controlId="formTraineeWeight" >
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
                                            <Form.Group controlId="formTrainerExperience" >
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
                                            <Form.Group controlId="formTrainerPaylink" >
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
                                        </> : null
                                }
                                <div className="text-center">
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}> {/* Added alignment for buttons */}
                                        <Button variant="primary" type="submit">
                                            Update Profile
                                        </Button>

                                        <Button variant="primary" onClick={() => reset()}>
                                            Reset
                                        </Button>

                                        <Button variant="primary" onClick={() => history.push('/profile')}>
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

export default EditProfileComponent; // Export the EditProfileComponent component