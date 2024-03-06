import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Card } from 'react-bootstrap';
import '../styles/home.css';

const TermsPage = () => {
    return (
        <Container fluid="md">
            <Card>
                <Card.Body>
                    <Card.Title>
                        <h1>Terms of Service</h1>
                    </Card.Title>
                    <Card.Text>
                        <p><b>By using Fit & Meet, you agree to the following terms:</b></p>
                        <ul style={{ textAlign: 'left', marginLeft: '20px' }}>
                            <li>Fit & Meet is a social platform for fitness enthusiasts that helps you connect with trainers in your area and find workout routines that suit your needs.</li>
                            <li>Fit & Meet is not responsible for any injuries that may occur while using the platform. Always consult with a professional trainer before starting a new workout routine.</li>
                            <li>Fit & Meet is not responsible for any damages that may occur to your property while using the platform.</li>
                            <li>Fit & Meet is not responsible for any loss of data that may occur while using the platform.</li>
                            <li>Fit & Meet is not responsible for any financial loss that may occur while using the platform.</li>
                            <li>Fit & Meet is not responsible for any emotional distress that may occur while using the platform.</li>
                            <li>The information provided on Fit & Meet is for general information purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</li>
                            <li>Fit & Meet reserves the right to change these terms at any time without notice.</li>
                        </ul>

                        <h2>Changes to this Privacy Notice</h2>
                        <p>
                            We keep our privacy notice under regular review. This privacy notice was last updated on March 6th, 2024.
                        </p>

                        <h2>How to Contact Us</h2>
                        <p>
                            If you have any questions about these terms, please contact us at <Link to="mailto:fitmeet@gmail.com">fitmeet@gmail.com</Link>.
                        </p>

                        <p>Thank you for using Fit & Meet!</p>
                    </Card.Text>
                    <div className="text-center">
                        <Button variant="primary" as={Link} to="/">Go Home</Button>
                        <Button variant="primary" onClick={() => window.history.back()}>Go Back</Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TermsPage; // Export the TermsPage component