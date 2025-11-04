import React, { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Placeholder from "react-bootstrap/Placeholder";

import { createTodo, listTodos, removeTodo, toggleTodo } from "../api";

export default function TodoDashboard() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      setError(null);
      const response = await createTodo({ title: newTodo });
      setTodos((previous) => [...previous, response.todo]);
      setNewTodo("");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      setError(null);
      const response = await toggleTodo(id);
      setTodos((previous) =>
        previous.map((todo) =>
          todo._id === id ? { ...todo, completed: response.todo.completed } : todo
        )
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await removeTodo(id);
      setTodos((previous) => previous.filter((todo) => todo._id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const hasTodos = useMemo(() => todos.length > 0, [todos]);

  return (
    <Card className="todo-card fade-in">
      <Card.Body>
        <Card.Title className="mb-4 d-flex align-items-center gap-2">
          <span className="emoji">✅</span>
          <span>Le tue attività</span>
        </Card.Title>
        <Form className="mb-3" onSubmit={handleAddTodo}>
          <Form.Group className="d-flex" controlId="newTodo">
            <Form.Control
              placeholder="Aggiungi una nuova attività"
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              className="input-glow"
            />
            <Button type="submit" variant="primary" className="ms-2 btn-raise">
              Aggiungi
            </Button>
          </Form.Group>
        </Form>
        {error ? <p className="text-danger shake-in">{error}</p> : null}
        {loading ? (
          <div className="d-grid gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Placeholder key={index} animation="wave" className="rounded p-2" />
            ))}
          </div>
        ) : (
          <ListGroup className="todo-list">
            {todos.map((todo) => (
              <ListGroup.Item
                key={todo._id}
                className={`d-flex justify-content-between align-items-center todo-item ${
                  todo.completed ? "todo-item--completed" : ""
                }`}
              >
                <button
                  type="button"
                  className={`btn btn-link text-start flex-grow-1 todo-toggle ${
                    todo.completed ? "text-decoration-line-through" : ""
                  }`}
                  onClick={() => handleToggle(todo._id)}
                >
                  {todo.title}
                </button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-3 btn-ghost"
                  onClick={() => handleDelete(todo._id)}
                >
                  Elimina
                </Button>
              </ListGroup.Item>
            ))}
            {hasTodos ? null : <ListGroup.Item>Nessuna attività ancora.</ListGroup.Item>}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}
