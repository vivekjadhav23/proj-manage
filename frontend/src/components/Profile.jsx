import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Navbar, Nav, NavDropdown, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [formData, setFormData] = useState({ name: storedUser?.name || '', email: storedUser?.email || '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5000/api/users/${storedUser.id}`, formData);

            const newUserContext = { ...storedUser, name: res.data.name, email: res.data.email };
            localStorage.setItem('user', JSON.stringify(newUserContext));

            setStatus({ type: 'success', msg: 'Identity updated successfully.' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        } catch (err) {
            setStatus({ type: 'danger', msg: 'System error: Could not update profile.' });
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="d-flex flex-column bg-body-tertiary" style={{ minHeight: '100vh' }}>
            {/* --- SHARED NAVBAR --- */}
            <Navbar bg="body" expand="lg" className="shadow-sm sticky-top py-3 border-bottom border-light">
                <Container>
                    <Navbar.Brand
                        as={Link}
                        to="/"
                        className="fw-bold text-primary d-flex align-items-center gap-2 fs-4"
                    >
                        <i className="bi bi-stack"></i> TaskFlow
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto ms-lg-4">
                            <Nav.Link as={Link} to="/dashboard" className="fw-semibold px-3">Workspaces</Nav.Link>
                        </Nav>
                        <Nav className="align-items-center gap-2">
                            <Button variant="link" className="text-secondary shadow-none border-0" onClick={toggleTheme}>
                                {theme === 'dark' ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-stars-fill"></i>}
                            </Button>
                            <NavDropdown
                                title={<span className="fw-bold text-body">👤 {storedUser?.name}</span>}
                                id="user-dropdown"
                                align="end"
                            >
                                <NavDropdown.Item as={Link} to="/profile">Account Settings</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout} className="text-danger">Sign Out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* --- PROFILE CONTENT --- */}
            <main className="flex-grow-1 py-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={7}>
                            <header className="mb-4">
                                <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none p-0 mb-2 text-muted small d-flex align-items-center gap-1">
                                    <i className="bi bi-chevron-left"></i> Return to Workspace
                                </Button>
                                <h2 className="fw-bold tracking-tight">Account Hub</h2>
                                <p className="text-muted">Modify your administrative credentials and preferences.</p>
                            </header>

                            <Card className="shadow-sm border-0 rounded-4 overflow-hidden bg-body border-start border-4 border-primary">
                                <Card.Body className="p-5">
                                    <Row className="align-items-center mb-5">
                                        <Col xs="auto">
                                            <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm fw-bold border border-primary-subtle"
                                                style={{ width: '85px', height: '85px', fontSize: '2rem' }}>
                                                {formData.name.charAt(0).toUpperCase()}
                                            </div>
                                        </Col>
                                        <Col>
                                            <h4 className="fw-bold mb-0 text-body">{formData.name}</h4>
                                            <p className="text-muted small mb-0">System Administrator</p>
                                        </Col>
                                    </Row>

                                    {status.msg && (
                                        <Alert variant={status.type} className="py-2 text-center small border-0 shadow-sm rounded-3 mb-4">
                                            <i className={`bi ${status.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                                            {status.msg}
                                        </Alert>
                                    )}

                                    <Form onSubmit={handleUpdate}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">Display Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="bg-body-tertiary border-0 py-2 rounded-3 shadow-none"
                                                placeholder="Update display name"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">Primary Email Address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="bg-body-tertiary border-0 py-2 rounded-3 shadow-none"
                                                placeholder="Update primary email"
                                            />
                                        </Form.Group>

                                        <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                                            <Button variant="light" onClick={() => navigate(-1)} className="px-4 rounded-pill fw-bold border-0">
                                                Discard
                                            </Button>
                                            <Button variant="primary" type="submit" className="px-5 fw-bold rounded-pill shadow-sm">
                                                Save Changes
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>

                            {/* Security Section */}
                            <Card className="mt-4 shadow-sm border-0 rounded-4 bg-body p-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="text-primary fs-3"><i className="bi bi-shield-lock"></i></div>
                                    <div>
                                        <h6 className="fw-bold mb-0">Security Protocols</h6>
                                        <p className="text-muted small mb-0">Multi-factor authentication and session logs are managed by corporate policy.</p>
                                    </div>
                                    <Button variant="outline-secondary" size="sm" className="ms-auto rounded-pill px-3" disabled>Manage</Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-body border-top py-4 mt-auto">
                <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
                    <p className="mb-0">© 2026 TaskFlow Systems. Security Verified.</p>
                    <div className="d-flex gap-3 mt-2 mt-md-0">
                        <span>Security Policy</span>
                        <span>System Status</span>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default Profile;