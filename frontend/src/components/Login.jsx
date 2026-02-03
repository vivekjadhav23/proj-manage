import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      
      // Save the session
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Smooth redirect to the professional dashboard
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center bg-body-tertiary" 
         style={{ minHeight: '100vh', width: '100vw' }}>
      <Container style={{ maxWidth: '420px' }}>
        <Card className="shadow-lg border-0 rounded-4 overflow-hidden bg-body">
          {/* Professional top accent line */}
          <div className="bg-primary py-1" style={{ width: '100%' }}></div>
          
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div className="text-primary fs-1 mb-2">
                <i className="bi bi-stack"></i>
              </div>
              <h2 className="fw-bold">Welcome Back</h2>
              <p className="text-muted small">Log in to your engineering workspace</p>
            </div>

            {error && (
              <Alert variant="danger" className="py-2 text-center small border-0 shadow-sm rounded-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
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
                <div className="d-flex justify-content-between align-items-center">
                    <Form.Label className="small fw-bold text-muted text-uppercase tracking-wider">Password</Form.Label>
                    <Link to="#" className="small text-decoration-none mb-2" style={{ fontSize: '0.7rem' }}>Forgot?</Link>
                </div>
                <Form.Control 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-body-tertiary border-0 py-2 rounded-3 shadow-none" 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold shadow-sm rounded-pill mb-3">
                Sign In
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p className="small text-muted mb-0">
                New to TaskFlow?{' '}
                <Link to="/register" className="text-primary fw-bold text-decoration-none">
                  Create an account
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
        
        <p className="text-center text-muted x-small mt-4" style={{ fontSize: '0.75rem' }}>
          © 2026 TaskFlow Systems. High-Performance Collaboration.
        </p>
      </Container>
    </div>
  );
};

export default Login;