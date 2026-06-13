import React, { useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import Login from './Login';
import Register from './Register';

const AuthForm = () => {
  const [activeForm, setActiveForm] = useState('login');

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4" style={{ width: '400px' }}>
        <div className="d-flex justify-content-around mb-3">
          <Button
            variant={activeForm === 'login' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveForm('login')}
          >
            Login
          </Button>
          <Button
            variant={activeForm === 'register' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveForm('register')}
          >
            Register
          </Button>
        </div>
        {activeForm === 'login' ? <Login /> : <Register />}
      </Card>
    </Container>
  );
};

export default AuthForm;
