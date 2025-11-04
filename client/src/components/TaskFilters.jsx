import { Col, Form, Row } from 'react-bootstrap';

const TaskFilters = ({ filters, onChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <Form className="mb-4">
      <Row className="g-3">
        <Col md={4}>
          <Form.Group controlId="search">
            <Form.Label>Cerca</Form.Label>
            <Form.Control
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Titolo, descrizione o tag"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="completed">
            <Form.Label>Stato</Form.Label>
            <Form.Select name="completed" value={filters.completed} onChange={handleChange}>
              <option value="">Tutti</option>
              <option value="true">Completati</option>
              <option value="false">Da completare</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="tag">
            <Form.Label>Tag</Form.Label>
            <Form.Control
              name="tag"
              value={filters.tag}
              onChange={handleChange}
              placeholder="Esempio: lavoro"
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default TaskFilters;
