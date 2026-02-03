import React from 'react';
import { Container, Row, Col, Button, Card, Navbar, Nav, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const user = JSON.parse(localStorage.getItem('user'));
const isAuthenticated = !!localStorage.getItem('token');

const Landing = () => {
    return (
        <div className="bg-body-tertiary min-vh-100 overflow-x-hidden">
            {/* --- NAVIGATION --- */}
            <Navbar bg="body" expand="lg" className="py-3 shadow-sm sticky-top border-bottom border-light">
                <Container>
                    {/* Brand now links to landing page explicitly */}
                    <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3 d-flex align-items-center gap-2">
                        <i className="bi bi-stack"></i> TaskFlow
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center gap-3 mt-3 mt-lg-0">
                            {/* Conditional Navigation based on Auth Status */}
                            {isAuthenticated ? (
                                <Button as={Link} to="/dashboard" variant="primary" className="rounded-pill px-4 fw-bold shadow-sm">
                                    Back to Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login" className="fw-semibold text-dark">Log in</Nav.Link>
                                    <Button as={Link} to="/register" variant="primary" className="rounded-pill px-4 fw-bold shadow-sm">
                                        Start Free Trial
                                    </Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* --- HERO SECTION --- */}
            <section className="py-5 text-center mt-lg-5">
                <Container>
                    <div className="animate-fade-in">
                        <Badge bg="primary-subtle" text="primary" className="rounded-pill px-3 py-2 mb-4 border border-primary-subtle">
                            New: Version 1.0 Enterprise is here
                        </Badge>
                        <h1 className="display-2 fw-bold mb-3 tracking-tight">
                            Shipping software? <br />
                            <span className="text-primary text-gradient">Master your workflow.</span>
                        </h1>
                        <p className="text-muted fs-5 mb-5 mx-auto" style={{ maxWidth: '800px' }}>
                            Engineered for modern product teams. TaskFlow eliminates fragmentation by
                            unifying your roadmap, sprints, and engineering metrics into one seamless experience.
                        </p>
                        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                            {/* Conditional Hero Button */}
                            {isAuthenticated ? (
                                <Button as={Link} to="/dashboard" size="lg" className="rounded-pill px-5 py-3 fw-bold shadow-lg">
                                    Open Workspace
                                </Button>
                            ) : (
                                <Button as={Link} to="/register" size="lg" className="rounded-pill px-5 py-3 fw-bold shadow-lg">
                                    Create Your Workspace
                                </Button>
                            )}
                            <Button variant="outline-dark" size="lg" className="rounded-pill px-5 py-3 fw-bold">
                                Watch Demo
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>

            {/* --- LOGO WALL --- */}
            <Container className="py-5 mt-5">
                <p className="text-center text-muted small fw-bold text-uppercase mb-4 tracking-widest">Trusted by fast-moving teams</p>
                <div className="d-flex flex-wrap justify-content-center gap-5 opacity-50 grayscale">
                    <h4 className="fw-bold">TECHCORP</h4>
                    <h4 className="fw-bold">CLOUDLY</h4>
                    <h4 className="fw-bold">NEXUS</h4>
                    <h4 className="fw-bold">QUANTUM</h4>
                </div>
            </Container>

            {/* --- BENTO GRID SECTION --- */}
            <Container className="py-5 mt-5">
                <Row className="g-4">
                    {/* Main Feature */}
                    <Col lg={8}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-shadow transition-all">
                            <Card.Body className="p-5">
                                <Badge bg="primary" className="mb-3 px-3">Engineered View</Badge>
                                <h2 className="fw-bold mb-3">The Smartest Kanban on the Market.</h2>
                                <p className="text-muted fs-5">
                                    Our board doesn't just hold tasks; it understands them. With automatic
                                    bottleneck detection and priority weightage, your team stays aligned on what matters most.
                                </p>
                                <div className="mt-5 pt-4 border-top">
                                    <div className="d-flex gap-4">
                                        <div><h5 className="fw-bold mb-0">99.9%</h5><small className="text-muted">Uptime</small></div>
                                        <div><h5 className="fw-bold mb-0">20ms</h5><small className="text-muted">Sync Latency</small></div>
                                        <div><h5 className="fw-bold mb-0">Encrypted</h5><small className="text-muted">At Rest</small></div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Secondary Feature */}
                    <Col lg={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 bg-dark text-white p-5 hover-shadow transition-all">
                            <div className="text-primary fs-1 mb-4"><i className="bi bi-shield-lock-fill"></i></div>
                            <h3 className="fw-bold">Security First.</h3>
                            <p className="opacity-75">
                                Every project is isolated and encrypted. Our JWT-based session management
                                ensures your corporate data never leaves your control.
                            </p>
                        </Card>
                    </Col>

                    {/* Stats Card */}
                    <Col md={6} lg={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-5 bg-body hover-shadow transition-all">
                            <div className="text-primary fs-1 mb-3"><i className="bi bi-graph-up-arrow"></i></div>
                            <h4 className="fw-bold">Deep Insights</h4>
                            <p className="text-muted">Built-in burndown charts and velocity analysis help you predict delivery dates with 95% accuracy.</p>
                        </Card>
                    </Col>

                    {/* Team Card */}
                    <Col md={6} lg={8}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-5 bg-primary text-white hover-shadow transition-all">
                            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-4">
                                <div className="flex-grow-1">
                                    <h3 className="fw-bold">Built for Cross-Functional Teams.</h3>
                                    <p className="opacity-75 mb-0">From designers to developers, TaskFlow provides a unified source of truth for the entire company.</p>
                                </div>
                                <div className="d-flex gap-n2">
                                    <div className="avatar-circle">A</div>
                                    <div className="avatar-circle">B</div>
                                    <div className="avatar-circle">C</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* --- CALL TO ACTION --- */}
            <section className="py-5 mb-5 mt-5">
                <Container>
                    <div className="bg-dark text-white rounded-5 p-5 text-center shadow-lg border-top border-4 border-primary">
                        <h2 className="display-5 fw-bold mb-4">Ready to accelerate your delivery?</h2>
                        <p className="opacity-75 fs-5 mb-5 mx-auto" style={{ maxWidth: '600px' }}>Join over 5,000 engineering teams who trust TaskFlow to build the future.</p>
                        <Button as={Link} to="/register" size="lg" className="rounded-pill px-5 py-3 fw-bold shadow">
                            Get Started for Free
                        </Button>
                    </div>
                </Container>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-5 bg-white border-top">
                <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div className="fw-bold text-primary mb-3 mb-md-0">TaskFlow.</div>
                    <div className="d-flex gap-4 text-muted small">
                        <span>Platform</span>
                        <span>Pricing</span>
                        <span>Terms</span>
                        <span>Privacy</span>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default Landing;