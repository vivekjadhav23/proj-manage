import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Navbar, Nav, NavDropdown, Badge, ProgressBar, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/projects/${user.id}`);
            setProjects(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleCreate = async () => {
        if (!newProject.name) return;
        try {
            await axios.post('http://localhost:5000/api/projects', { ...newProject, ownerId: user.id });
            setShow(false);
            setNewProject({ name: '', description: '' });
            fetchProjects();
        } catch (err) {
            console.error("Creation error:", err);
        }
    };

    const handleDelete = async (e, projectId) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm("System Warning: Permanent deletion of this node cannot be undone. Proceed?")) {
            try {
                await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
                fetchProjects();
            } catch (err) {
                alert("Critical: Could not terminate project node.");
            }
        }
    };

    return (
        <div className="d-flex flex-column bg-body-tertiary" style={{ minHeight: '100vh' }}>
            {/* --- TOP NAVIGATION HUB --- */}
            <Navbar bg="body" expand="lg" className="shadow-sm sticky-top py-3 border-bottom border-light">
                <Container fluid className="px-lg-5">
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
                            <Nav.Link as={Link} to="/dashboard" className="fw-semibold px-3 active">Workspaces</Nav.Link>
                            <Nav.Link href="#" className="fw-semibold px-3 text-muted">Network</Nav.Link>
                        </Nav>
                        <Nav className="align-items-center gap-3">
                            <Button variant="link" className="text-secondary shadow-none border-0 fs-5 p-0" onClick={toggleTheme}>
                                {theme === 'dark' ? <i className="bi bi-sun-fill text-warning"></i> : <i className="bi bi-moon-stars-fill"></i>}
                            </Button>
                            <div className="vr d-none d-lg-block opacity-25" style={{ height: '50px' }}></div>
                            <NavDropdown
                                title={<span className="fw-bold text-body">👤 {user?.name}</span>}
                                id="user-dropdown"
                                align="end"
                            >
                                <NavDropdown.Item as={Link} to="/profile"><i className="bi bi-person-gear me-2"></i>Profile Settings</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-danger">
                                    <i className="bi bi-power me-2"></i>Terminate Session
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* --- MAIN DASHBOARD BODY --- */}
            <main className="flex-grow-1 py-4">
                <Container fluid className="px-lg-5">
                    {/* --- GLOBAL METRICS BAR --- */}
                    <Row className="mb-4 g-3">
                        <Col lg={3}>
                            <Card className="border-0 shadow-sm rounded-4 p-3 bg-body h-100">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h6 className="text-muted small fw-bold text-uppercase mb-1">Total Nodes</h6>
                                        <h3 className="fw-bold mb-0">{projects.length}</h3>
                                    </div>
                                    <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle"><i className="bi bi-hdd-network"></i></div>
                                </div>
                            </Card>
                        </Col>
                        <Col lg={3}>
                            <Card className="border-0 shadow-sm rounded-4 p-3 bg-body h-100">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h6 className="text-muted small fw-bold text-uppercase mb-1">System Health</h6>
                                        <h3 className="fw-bold mb-0 text-success">99.9%</h3>
                                    </div>
                                    <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle animate-pulse"><i className="bi bi-shield-check"></i></div>
                                </div>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card className="border-0 shadow-sm rounded-4 p-3 bg-primary text-white h-100">
                                <div className="d-flex align-items-center justify-content-between h-100 px-2">
                                    <div>
                                        <h5 className="fw-bold mb-0">Initialize New Engineering Workspace</h5>
                                        <small className="opacity-75">Deploy Kanban boards for team coordination.</small>
                                    </div>
                                    <Button variant="light" className="rounded-pill fw-bold px-4" onClick={() => setShow(true)}>+ Deploy</Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        {/* --- LEFT: PROJECT GRID --- */}
                        <Col lg={8}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold mb-0">Active Repositories</h4>
                                <Badge bg="primary-subtle" text="primary" className="rounded-pill px-3">Live Updates</Badge>
                            </div>

                            {loading ? (
                                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                            ) : (
                                <Row className="g-4">
                                    {projects.map(p => (
                                        <Col key={p._id} md={6}>
                                            <Card className="h-100 border-0 shadow-sm hover-shadow transition-all rounded-4 bg-body border-start border-4 border-primary">
                                                <Card.Body className="p-4 d-flex flex-column">
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <h5 className="fw-bold mb-0 text-truncate">{p.name}</h5>
                                                        <Button variant="link" className="p-0 text-danger shadow-none border-0" onClick={(e) => handleDelete(e, p._id)}>
                                                            <i className="bi bi-trash3"></i>
                                                        </Button>
                                                    </div>
                                                    <Card.Text className="text-muted small mb-4 flex-grow-1">
                                                        {p.description || "Systematic roadmap management and infrastructure tracking."}
                                                    </Card.Text>
                                                    <Link to={`/project/${p._id}`} className="mt-auto">
                                                        <Button variant="outline-primary" className="w-100 rounded-pill fw-bold py-2">Open Interface</Button>
                                                    </Link>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Col>

                        {/* --- RIGHT: ACTIVITY SIDEBAR --- */}
                        <Col lg={4}>
                            <Card className="border-0 shadow-sm rounded-4 bg-body h-100">
                                <Card.Header className="bg-transparent border-0 pt-4 px-4 pb-0 d-flex justify-content-between">
                                    <h5 className="fw-bold mb-0">System Activity</h5>
                                    <i className="bi bi-three-dots text-muted"></i>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    <ListGroup variant="flush" className="small">
                                        {[
                                            { icon: 'bi-plus-circle', text: 'New project "Infrastructure" initialized', time: '2m ago', color: 'primary' },
                                            { icon: 'bi-person-check', text: 'Vivek joined the engineering team', time: '1h ago', color: 'success' },
                                            { icon: 'bi-check-all', text: 'Sprint 04 completed successfully', time: '5h ago', color: 'info' },
                                            { icon: 'bi-shield-lock', text: 'Security patch v1.02 deployed', time: '12h ago', color: 'warning' },
                                            { icon: 'bi-cloud-arrow-up', text: 'System backup synchronized', time: '1d ago', color: 'secondary' }
                                        ].map((item, idx) => (
                                            <ListGroup.Item key={idx} className="bg-transparent px-0 py-3 border-light-subtle d-flex gap-3">
                                                <div className={`text-${item.color} fs-5`}><i className={`bi ${item.icon}`}></i></div>
                                                <div>
                                                    <div className="fw-bold text-body">{item.text}</div>
                                                    <div className="text-muted x-small" style={{ fontSize: '11px' }}>{item.time}</div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                    <Button variant="light" className="w-100 mt-3 rounded-pill fw-bold text-muted btn-sm border">View All Logs</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-body border-top py-4 mt-auto">
                <Container fluid className="px-lg-5 d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
                    <p className="mb-0 fw-medium"><i className="bi bi-shield-check text-success me-2"></i>TaskFlow Enterprise v1.0.26</p>
                    <div className="d-flex gap-4">
                        <span>API Status</span>
                        <span>Security Protocol</span>
                        <span>Support</span>
                    </div>
                </Container>
            </footer>

            {/* --- CREATE MODAL --- */}
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Body className="p-4 bg-body rounded-4">
                    <h5 className="fw-bold mb-4">Initialize Workspace</h5>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">PROJECT TITLE</Form.Label>
                            <Form.Control type="text" className="bg-body-tertiary border-0 py-2" placeholder="e.g. Migration Sprint" onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-muted">TECHNICAL BRIEF</Form.Label>
                            <Form.Control as="textarea" rows={3} className="bg-body-tertiary border-0" placeholder="Scope of work..." onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
                        </Form.Group>
                        <Button variant="primary" className="w-100 rounded-pill fw-bold py-2 shadow" onClick={handleCreate}>Confirm Deployment</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Dashboard;