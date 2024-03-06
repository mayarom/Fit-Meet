import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';

// NotFoundPage component that defines the structure of the 404 page
// This component is rendered when the user tries to access a page that does not exist
// It provides a button to go back to the previous page
const NotFoundPage = () => {
    const history = useHistory();

    React.useEffect(() => {
        // Set the HTTP status code to 404
        document.title = '404: Page Not Found';
        return () => {
            // Cleanup code, if needed
        };
    }, []);

    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <React.Fragment>
            <Container fluid="md">
                <Card>
                    <Card.Body>
                        <Card.Title>404: Page Not Found</Card.Title>
                        <Card.Text>
                            <p>We are sorry to inform you that the page you are looking for does not exist.</p>
                            <p>This could be due to one of the following reasons:</p>
                            <ul style={{ textAlign: 'left', marginLeft: '20px' }}>
                                <li>The page has been moved or deleted. For example, you may have followed an outdated link.</li>
                                <li>The URL is incorrect. For example, you may have mistyped the URL.</li>
                                <li>The page is temporarily unavailable. This one is on us - we apologize for the inconvenience.</li>
                            </ul>

                            <p>Please check the URL and try again.</p>
                            <p>If you think this is an error, please contact the website administrator.</p>

                            <p className="mt-4">Here are some details about your request:</p>
                            <ul style={{ textAlign: 'left', marginLeft: '20px' }}>
                                <li>Requested URL: <Link to={window.location.pathname}>{window.location.href}</Link></li>
                                <li>Timestamp: {new Date().toLocaleString()}</li>
                                <li>Browser: {navigator.userAgent}</li>
                                <li>IP Address: {window.location.hostname}</li>
                                <li>Language: { window.navigator.language }</li>
                            </ul>

                            <p>Thank you for your understanding.</p>
                        </Card.Text>
                        <div className="text-center">
                            <Button variant="primary" as={Link} to="/">Go Home</Button>
                            <Button variant="secondary" className="ml-2" onClick={handleGoBack}>Go Back</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default NotFoundPage; // Export the NotFoundPage component
