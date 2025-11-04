import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

import { login as loginRequest, register as registerRequest } from "../api";

export default function AuthForms({ mode = "login", onLogin }) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isRegister = mode === "register";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = isRegister
        ? await registerRequest(formState)
        : await loginRequest({ email: formState.email, password: formState.password });

      onLogin(payload.user);
      navigate("/todos");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitLabel = useMemo(() => {
    if (submitting) {
      return "Invio in corso…";
    }
    return isRegister ? "Registrati" : "Accedi";
  }, [isRegister, submitting]);

  return (
    <Card className="mx-auto auth-card fade-in" style={{ maxWidth: "420px" }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center fw-semibold">
          {isRegister ? "Crea un nuovo account" : "Accedi"}
        </Card.Title>
        {error ? (
          <Alert variant="danger" className="mb-4 shake-in">
            {error}
          </Alert>
        ) : null}
        <Form onSubmit={handleSubmit} className="d-grid gap-3">
          {isRegister ? (
            <Form.Group controlId="name">
              <Form.Label>Nome completo</Form.Label>
              <Form.Control
                name="name"
                placeholder="Mario Rossi"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          ) : null}
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="nome@esempio.com"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Scegli una password sicura"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          {isRegister ? (
            <Form.Group controlId="confirmPassword">
              <Form.Label>Conferma password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Ripeti la password"
                value={formState.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>
          ) : null}
          <div className="d-grid gap-2 mt-2">
            <Button type="submit" variant="primary" disabled={submitting} className="btn-raise">
              {submitLabel}
            </Button>
            <Button
              variant="link"
              className="p-0 link-animated"
              onClick={() => navigate(isRegister ? "/login" : "/register")}
            >
              {isRegister ? "Hai già un account? Accedi" : "Non hai un account? Registrati"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
