import { Router } from 'express';
import { body } from 'express-validator';

import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

const baseValidations = [
  body('title').optional().notEmpty().withMessage('Il titolo non può essere vuoto'),
  body('description').optional().isString(),
  body('completed').optional().isBoolean(),
  body('dueDate').optional().isISO8601().toDate(),
  body('tags').optional().isArray(),
];

router.use(authenticate);

router.get('/', listTasks);
router.post('/', [body('title').notEmpty().withMessage('Il titolo è obbligatorio'), ...baseValidations], createTask);
router.get('/:id', getTask);
router.put('/:id', baseValidations, updateTask);
router.delete('/:id', deleteTask);

export default router;
