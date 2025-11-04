import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const defaultValues = {
  title: '',
  description: '',
  dueDate: '',
  tags: '',
};

const TaskForm = ({ show, onHide, onSubmit, initialValues }) => {
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title || '',
        description: initialValues.description || '',
        dueDate: initialValues.dueDate ? initialValues.dueDate.slice(0, 10) : '',
        tags: initialValues.tags?.join(', ') || '',
      });
    } else {
      setValues(defaultValues);
    }
  }, [initialValues, show]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      title: values.title,
      description: values.description,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
      tags: values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
    onSubmit(payload);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialValues ? 'Modifica attività' : 'Nuova attività'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Titolo dell'attività"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Aggiungi dettagli"
            />
          </Form.Group>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="dueDate">
                <Form.Label>Scadenza</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={values.dueDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="tags">
                <Form.Label>Tag (separati da virgola)</Form.Label>
                <Form.Control
                  name="tags"
                  value={values.tags}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Annulla
          </Button>
          <Button type="submit" variant="primary">
            {initialValues ? 'Aggiorna' : 'Crea'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TaskForm;
