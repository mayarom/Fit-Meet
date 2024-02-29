import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import '../../styles/admin.css';

const AdminComponent = () => {
    return (
        <Container fluid="md">
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Admin Control Panel</Card.Title>
                            <Card.Text>
                                Welcome to the admin control panel. From here, you can manage the users and exercises in the system.
                            </Card.Text>
                            <div className="text-center">
                                <Button variant="primary" href="/admin/list">View Users</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminComponent; // Export the AdminComponent component