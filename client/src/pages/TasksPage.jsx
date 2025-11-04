import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Spinner, Stack } from 'react-bootstrap';
import TaskFilters from '../components/TaskFilters.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import { useAuth } from '../hooks/useAuth.js';
import {
  createTaskRequest,
  deleteTaskRequest,
  fetchTasks,
  updateTaskRequest,
} from '../services/taskService.js';

const initialFilters = {
  search: '',
  completed: '',
  tag: '',
};

const TasksPage = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const debouncedFilters = useMemo(() => filters, [filters]);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasks(token, debouncedFilters);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters]);

  const handleCreate = async (payload) => {
    try {
      if (selectedTask) {
        await updateTaskRequest(token, selectedTask._id, payload);
      } else {
        await createTaskRequest(token, payload);
      }
      setShowForm(false);
      setSelectedTask(null);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleCompleted = async (task) => {
    try {
      await updateTaskRequest(token, task._id, { completed: !task.completed });
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (task) => {
    try {
      await deleteTaskRequest(token, task._id);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  return (
    <>
      <Stack direction="horizontal" className="mb-4" gap={3}>
        <h1 className="flex-grow-1 mb-0">Le mie attività</h1>
        <Button onClick={() => setShowForm(true)}>Nuova attività</Button>
      </Stack>
      {error && <Alert variant="danger">{error}</Alert>}
      <TaskFilters filters={filters} onChange={setFilters} />
      {loading ? <Spinner animation="border" role="status" /> : <TaskList tasks={tasks} onToggleCompleted={handleToggleCompleted} onEdit={handleEdit} onDelete={handleDelete} />}
      <TaskForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setSelectedTask(null);
        }}
        onSubmit={handleCreate}
        initialValues={selectedTask}
      />
    </>
  );
};

export default TasksPage;
