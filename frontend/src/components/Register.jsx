import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      
      // Auto-Login: Save credentials immediately
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Smooth redirect to professional workspace
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center bg-body-tertiary" 
         style={{ minHeight: '100vh', width: '100vw' }}>
      <Container style={{ maxWidth: '480px' }}>
        <Card className="shadow-lg border-0 rounded-4 overflow-hidden bg-body">
          {/* Professional top accent line */}
          <div className="bg-primary py-1" style={{ width: '100%' }}></div>
          
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div className="text-primary fs-1 mb-2">
                <i className="bi bi-stack"></i>
              </div>
              <h2 className="fw-bold text-gradient-static">Create Workspace</h2>
              <p className="text-muted small">Join 5,000+ teams engineering the future.</p>
            </div>

            {error && (
              <Alert variant="danger" className="py-2 text-center small border-0 shadow-sm rounded-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">Full Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g. Alex Rivera" 
                  className="bg-body-tertiary border-0 py-2 rounded-3 shadow-none"
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">Work Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="name@company.com" 
                  className="bg-body-tertiary border-0 py-2 rounded-3 shadow-none"
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Min. 8 characters" 
                  className="bg-body-tertiary border-0 py-2 rounded-3 shadow-none"
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold shadow-sm rounded-pill mb-3">
                Get Started Free
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p className="small text-muted mb-0">
                Already using TaskFlow?{' '}
                <Link to="/login" className="text-primary fw-bold text-decoration-none">Log in</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
        
        <p className="text-center text-muted x-small mt-4" style={{ fontSize: '0.75rem' }}>
          By signing up, you agree to our <span className="text-decoration-underline">Terms of Service</span>.
        </p>
      </Container>
    </div>
  );
};

export default Register;