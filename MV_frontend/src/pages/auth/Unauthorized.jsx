import React from 'react';
import { Container } from 'react-bootstrap';

const Unauthorized = () => {
  return (
    <Container className="mt-5 text-center">
      <h1 className="text-danger">🚫 Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
    </Container>
  );
};

export default Unauthorized;
