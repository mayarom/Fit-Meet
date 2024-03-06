import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Card } from 'react-bootstrap';
import '../styles/home.css';

const PrivacyPage = () => {
    return (
        <Container fluid="md">
            <Card>
                <Card.Body>
                    <Card.Title>
                        <h1>Privacy Policy</h1>
                    </Card.Title>
                    <Card.Text>
                        <p>
                            Fit & Meet is committed to protecting your privacy. We will only use the information that we collect about you lawfully (in accordance with the Data Protection Act 1998 and the <a href="https://gdpr-info.eu/">General Data Protection Regulation (GDPR)</a>). We collect information about you for 2 reasons: firstly, to process your order and second, to provide you with the best possible service. We will not e-mail you in the future unless you have given us your consent. We will give you the chance to refuse any marketing email from us in the future. The type of information we will collect about you includes:
                        </p>

                        <ul style={{ textAlign: 'left', marginLeft: '20px' }}>
                            <li>Your name</li>
                            <li>Address</li>
                            <li>Phone number</li>
                            <li>Email address</li>
                        </ul>
                        
                        <p>
                            We will never collect sensitive information about you without your explicit consent. The information we hold will be accurate and up to date. You can check the information that we hold about you by emailing us. If you find any inaccuracies we will delete or correct it promptly. The personal information which we hold will be held securely in accordance with our internal security policy and the law. If we intend to transfer your information outside the EEA (European Economic Area) we will always obtain your consent first. We may use technology to track the patterns of behavior of visitors to our site. If you have any questions/comments about privacy, you should email us at <Link to="mailto:fitmeet@gmail.com">fitmeet@gmail.com</Link>.
                        </p>

                        <h2>Use of Cookies</h2>
                        <p>
                            Cookies are small text files that are placed on your computer by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site. The table below explains the cookies we use and why.
                        </p>

                        <h3>Google Analytics</h3>
                        <p>
                            These cookies are used to collect information about how visitors use our site. We use the information to compile reports and to help us improve the site. The cookies collect information in an anonymous form, including the number of visitors to the site, where visitors have come to the site from and the pages they visited. For more information on Google Analytic's privacy policy visit here: <a href="https://policies.google.com/privacy?hl=en-US">Google Analytics - Safeguarding your data</a>.
                        </p>

                        <h3>Session Cookies</h3>
                        <p>
                            These cookies are essential for the operation of the site. They enable us to keep track of your movement from page to page and store your selections so you do not get asked repeatedly for the same information. They are removed when you leave the site or close your browser.
                        </p>

                        <h3>Third Party Cookies</h3>
                        <p>
                            We use a number of suppliers who may also set cookies on their websites' on its behalf. Fit & Meet does not control the dissemination of these cookies. You should check the third party websites for more information about these.
                        </p>

                        <h2>Links to Other Websites</h2>
                        <p>
                            This privacy notice does not cover the links within this site linking to other websites. We encourage you to read the privacy statements on the other websites you visit.
                        </p>

                        <h2>Changes to this Privacy Notice</h2>
                        <p>
                            We keep our privacy notice under regular review. This privacy notice was last updated on March 6th, 2024.
                        </p>

                        <h2>How to Contact Us</h2>
                        <p>
                            If you want to request information about our privacy policy, you can email us at <Link to="mailto:fitmeet@gmail.com">fitmeet@gmail.com</Link>.
                        </p>

                        <Button as={Link} to="/" variant="primary" className="my-btn">Back to Home</Button>
                        <Button as={Link} onClick={() => window.history.back()} variant="primary" className="my-btn">Go Back</Button>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PrivacyPage; // Export the PrivacyPage component