import { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPasswordError(false);
    setLoading(true);
    try {
      if (values.password !== values.confirmPassword) {
        setPasswordError(true);
        throw new Error('Le password non coincidono');
      }

      const { name, email, password } = values;
      await register({ name, email, password });
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 420 }}>
      <Card.Body>
        <h2 className="mb-4 text-center">Crea un account</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nome completo</Form.Label>
            <Form.Control
              name="name"
              placeholder="Mario Rossi"
              value={values.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="nome@esempio.com"
              value={values.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Minimo 6 caratteri"
              value={values.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>Conferma password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Ripeti la password"
              value={values.confirmPassword}
              onChange={handleChange}
              required
              isInvalid={passwordError}
            />
            <Form.Control.Feedback type="invalid">
              Le password devono coincidere.
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Registrazione...' : 'Registrati'}
          </Button>
        </Form>
        <p className="mt-3 mb-0 text-center">
          Hai già un account? <Link to="/login">Accedi</Link>
        </p>
      </Card.Body>
    </Card>
  );
};

export default RegisterPage;
