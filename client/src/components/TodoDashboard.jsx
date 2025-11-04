import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

import { createTodo, listTodos, removeTodo, toggleTodo } from '../api';

export default function TodoDashboard() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the todo list once on mount so the dashboard stays in sync.
    async function loadTodos() {
      try {
        const response = await listTodos();
        setTodos(response.todos);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadTodos();
  }, []);

  const handleAddTodo = async (event) => {
    event.preventDefault();
    if (!newTodo.trim()) {
      return;
    }

    try {
      const response = await createTodo({ title: newTodo });
      setTodos((previous) => [...previous, response.todo]);
      setNewTodo('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await toggleTodo(id);
      setTodos((previous) =>
        previous.map((todo) => (todo._id === id ? { ...todo, completed: response.todo.completed } : todo))
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeTodo(id);
      setTodos((previous) => previous.filter((todo) => todo._id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-4">Le tue attività</Card.Title>
        <Form className="mb-3" onSubmit={handleAddTodo}>
          <Form.Group className="d-flex" controlId="newTodo">
            <Form.Control
              placeholder="Aggiungi una nuova attività"
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
            />
            <Button type="submit" variant="primary" className="ms-2">
              Aggiungi
            </Button>
          </Form.Group>
        </Form>
        {error && <p className="text-danger">{error}</p>}
        {loading ? (
          <p>Caricamento in corso…</p>
        ) : (
          <ListGroup>
            {todos.map((todo) => (
              <ListGroup.Item
                key={todo._id}
                className="d-flex justify-content-between align-items-center"
              >
                <span
                  role="button"
                  onClick={() => handleToggle(todo._id)}
                  className={todo.completed ? 'text-decoration-line-through' : ''}
                >
                  {todo.title}
                </span>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(todo._id)}>
                  Elimina
                </Button>
              </ListGroup.Item>
            ))}
            {todos.length === 0 && <ListGroup.Item>Nessuna attività ancora.</ListGroup.Item>}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}
