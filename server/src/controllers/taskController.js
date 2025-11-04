import { validationResult } from 'express-validator';

import { Task } from '../models/Task.js';

const buildFilters = (userId, query) => {
  const filters = { owner: userId };

  if (query.completed === 'true') {
    filters.completed = true;
  } else if (query.completed === 'false') {
    filters.completed = false;
  }

  if (query.search) {
    filters.$text = { $search: query.search };
  }

  if (query.tag) {
    filters.tags = query.tag;
  }

  return filters;
};

export const listTasks = async (req, res, next) => {
  try {
    const filters = buildFilters(req.user.id, req.query);
    const tasks = await Task.find(filters).sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Dati non validi', errors: errors.array() });
  }

  try {
    const task = await Task.create({ ...req.body, owner: req.user.id });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Attività non trovata' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Dati non validi', errors: errors.array() });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Attività non trovata' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Attività non trovata' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
