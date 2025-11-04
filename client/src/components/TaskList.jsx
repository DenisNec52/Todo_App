import { Badge, Button, Card, Stack } from 'react-bootstrap';

const TaskList = ({ tasks, onToggleCompleted, onEdit, onDelete }) => {
  if (!tasks.length) {
    return <p className="text-center text-muted">Nessuna attività trovata.</p>;
  }

  return (
    <Stack gap={3}>
      {tasks.map((task) => (
        <Card key={task._id} className={task.completed ? 'border-success' : ''}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <Card.Title className="mb-1">
                  {task.title}{' '}
                  {task.completed && <Badge bg="success">Completata</Badge>}
                </Card.Title>
                {task.dueDate && (
                  <Card.Subtitle className="text-muted">
                    Scadenza: {new Date(task.dueDate).toLocaleDateString('it-IT')}
                  </Card.Subtitle>
                )}
              </div>
              <Stack direction="horizontal" gap={2}>
                <Button variant="outline-success" size="sm" onClick={() => onToggleCompleted(task)}>
                  {task.completed ? 'Segna come da fare' : 'Segna come completata'}
                </Button>
                <Button variant="outline-primary" size="sm" onClick={() => onEdit(task)}>
                  Modifica
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(task)}>
                  Elimina
                </Button>
              </Stack>
            </div>
            {task.description && <Card.Text>{task.description}</Card.Text>}
            {task.tags?.length ? (
              <div className="d-flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Badge key={tag} bg="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </Card.Body>
        </Card>
      ))}
    </Stack>
  );
};

export default TaskList;
