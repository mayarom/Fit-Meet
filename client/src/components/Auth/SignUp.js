import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import '../../styles/signup_login.css';
import { useAuth } from '../../auth';

const SignUpPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [showAlert, setShowAlert] = useState(false);

    // Used to display the server response in an alert
    const [serverResponse, setServerResponse] = useState('');

    // Used to determine which type of alert to show (success or danger)
    const [responseType, setResponseType] = useState('');

    // Used to determine which option is selected in the dropdown of "Who are you?"
    const [selectedOption, setSelectedOption] = useState("");

    // Used to determine if the user is logged in already
    const [logged] = useAuth();
    const history = useHistory();

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

    const submitForm = (data) => {
        if (data.password === data.confirmPassword && data.email === data.confirmEmail) {
            const requestBody = {
                ...data
            };

            delete requestBody.confirmPassword; // Remove confirmPassword from the request body, as it's not needed on the server side
            delete requestBody.confirmEmail; // Remove confirmEmail from the request body, as it's not needed on the server side

            const requestOptions = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            };

            fetch('/auth/signup', requestOptions)
                .then(res => res.json())
                .then(responseData => {
                    setShowAlert(true);
                    if (responseData.success) {
                        setResponseType("success");
                        setServerResponse("User registered successfully, you will be redirected to the login page.");
                        reset(); // Reset the form fields

                        // Redirect to the login page after successful registration
                        setTimeout(() => {
                            window.location.href = "/login";
                        }, 2000);
                    } else {
                        setResponseType("danger");
                        setServerResponse("An error occurred: " + responseData.message);
                    }
                })
                .catch(err => {
                    setResponseType("danger");
                    console.error(err);
                    setServerResponse("Fatal error occurred. See console for details.");
                    setShowAlert(true);
                });
        }

        else if (data.email !== data.confirmEmail) {
            setResponseType("danger");
            setServerResponse("Emails do not match");
            setShowAlert(true);
        }

        else if (data.password !== data.confirmPassword) {
            setResponseType("danger");
            setServerResponse("Passwords do not match");
            setShowAlert(true);
        }
        else {
            setResponseType("danger");
            setServerResponse("Passwords and Emails do not match");
            setShowAlert(true);
        }
    };

    if (logged) {
        history.push('/');
        return (
            <div className="container mt-5">
                <Alert variant="info">You are already logged in</Alert>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="signup-form">
                {showAlert && (
                    <Alert variant={responseType} onClose={() => setShowAlert(false)} dismissible>
                        <p>{serverResponse}</p>
                    </Alert>
                )}
                <h2 className="page-title">Sign Up for Fit & Meet</h2>
                <Form onSubmit={handleSubmit(submitForm)}>
                    {/* Form fields and controls */}
                    {/* Username */}
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter a username"
                            {...register("username", {
                                required: "Username field is required.",
                                minLength: { value: 4, message: "Username must be at least 4 characters long." },
                                maxLength: { value: 20, message: "Username must be at most 20 characters long." },
                                pattern: {
                                    value: /^[a-zA-Z0-9_-]+$/,
                                    message: "Username can only contain ASCII characters, numbers, '_', and '-'."
                                }
                            })}
                        />
                        {errors.username && <p className="error-message">{errors.username.message}</p>}
                    </Form.Group>

                    {/* Email */}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" {...register("email", { required: true })} />
                        {errors.email && <p className="error-message">Email field is required.</p>}
                    </Form.Group>

                    {/* Confirm Email */}
                    <Form.Group controlId="formBasicConfirmEmail">
                        <Form.Label>Confirm Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Confirm your email"
                            {...register("confirmEmail", { required: true })}
                        />
                        {errors.confirmEmail && <p className="error-message">You must confirm your email.</p>}
                    </Form.Group>

                    {/* Password */}
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" {...register("password", { required: true })} />
                        {errors.password && <p className="error-message">Please enter a password.</p>}
                    </Form.Group>

                    {/* Confirm Password */}
                    <Form.Group controlId="formBasicConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            {...register("confirmPassword", { required: true })}
                        />
                        {errors.confirmPassword && <p className="error-message">You must confirm your password.</p>}
                    </Form.Group>

                    {/* Phone */}
                    <Form.Group controlId="formBasicPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter phone (e.g., 0501234567)"
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
                            {...register("phone", {
                                required: true,
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Please enter a valid 10-digit phone number containing only numbers.",
                                },
                            })}
                        />
                        {errors.phone && <p className="error-message">{errors.phone.message}</p>}
                    </Form.Group>

                    {/* Date of Birth */}
                    <Form.Group controlId="formBasicDob">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                            type="date"
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
                        />
                        {errors.dob && <p className="error-message">{errors.dob.message}</p>}
                    </Form.Group>

                    {/* City */}
                    <Form.Group controlId="formBasicCity">
                        <Form.Label>City</Form.Label>
                        <Form.Select {...register("city", { required: true })}>
                            <option value="" disabled>Select your city</option> {/* Placeholder */}
                            {cities.map((city, index) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </Form.Select>
                        {errors.city && <p className="error-message">City is required.</p>}
                    </Form.Group>

                    {/* Add some spacing between the two Form.Groups */}
                    <div className="mb-3"></div>

                    {/* Is Trainer */}
                    <Form.Group controlId="formBasicIsTrainer">
                        <Form.Label>Who are you?</Form.Label>
                        <Form.Select
                            {...register("permissions", { required: true })}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            value={selectedOption}
                        >
                            <option value="">Select an option</option>
                            <option key="1" value="trainee">I'm a trainee</option>
                            <option key="2" value="trainer">I'm a trainer</option>
                        </Form.Select>
                        {errors.permissions && <p className="error-message">Please select your role.</p>}
                    </Form.Group>

                    {/* Add some spacing between the two Form.Groups */}
                    <div className="mb-3"></div>

                    {selectedOption === "trainee" && (
                        <div>
                            {/* Goal */}
                            <Form.Group controlId="formBasicGoal">
                                <Form.Label>Goal</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your goal as a trainee"
                                    {...register("goal", { required: true })}
                                />
                                {errors.goal && <p className="error-message">Goal is required.</p>}
                            </Form.Group>

                            {/* Height and Weight */}
                            <Form.Group controlId="formBasicHeight">
                                <Form.Label>Height (m)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your height (in meters)"
                                    {...register("height", {
                                        required: true,
                                        pattern: {
                                            value: /^\d+(\.\d{1,2})?$/, // Matches positive floating-point numbers with up to 2 decimal places
                                            message: "Please enter a valid height in meters.",
                                        },
                                        validate: {
                                            validHeight: value => {
                                                const height = parseFloat(value);
                                                return height >= 1.0 && height <= 2.5;
                                            },
                                        },
                                    })}
                                />
                                {errors.height?.type === "validHeight" && <p className="error-message">Height must be between 1.00 and 2.50 meters.</p>}
                                {errors.height?.message && <p className="error-message">{errors.height.message}</p>}
                            </Form.Group>
                            <Form.Group controlId="formBasicWeight">
                                <Form.Label>Weight (kg)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your weight (in kilograms)"
                                    {...register("weight", {
                                        required: true,
                                        pattern: {
                                            value: /^\d+(\.\d{1,2})?$/, // Matches positive floating-point numbers with up to 2 decimal places
                                            message: "Please enter a valid weight in kilograms.",
                                        },
                                        validate: {
                                            validWeight: value => {
                                                const weight = parseFloat(value);
                                                return weight >= 40.0 && weight <= 300.0;
                                            },
                                        },
                                    })}
                                />
                                {errors.weight?.type === "validWeight" && <p className="error-message">Weight must be between 40.0 and 300.0 kilograms.</p>}
                                {errors.weight?.message && <p className="error-message">{errors.weight.message}</p>}
                            </Form.Group>
                        </div>
                    )}

                    {selectedOption === "trainer" && (
                        <div>
                            {/* Experience */}
                            <Form.Group controlId="formBasicExperience">
                                <Form.Label>Experience</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your experience as a trainer (e.g., 5 years, specialized in weight loss)"
                                    {...register("experience", { required: true })}
                                />
                                {errors.experience && <p className="error-message">Experience is required.</p>}
                            </Form.Group>

                            {/* Paylink */}
                            <Form.Group controlId="formBasicPaylink">
                                <Form.Label>Paylink</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter paylink (e.g., Paybox, Bit, etc.)"
                                    {...register("paylink", {
                                        required: true,
                                        pattern: {
                                            value: /^(ftp|http|https):\/\/[^ "]+$/,
                                            message: "Please enter a valid URL."
                                        }
                                    })}
                                />
                                {errors.paylink && <p className="error-message">{errors.paylink.message}</p>}
                            </Form.Group>

                        </div>
                    )}

                    <div className="text-center">
                        {/* Submit Button */}
                        <Button variant="primary" type="submit">Submit</Button>

                        {/* Reset Button */}
                        <Button variant="secondary" type="reset" onClick={() => reset()}>Reset</Button>
                    </div>

                    {/* Already have an account? */}
                    <Form.Group className="mt-3 text-center">
                        <small>
                            Already have an account? <Link to="/login">Log in</Link>
                        </small>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}

export default SignUpPage;
