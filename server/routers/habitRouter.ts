import express from 'express';
import habitController from '../controllers/habit.controller.ts';
import { requireUser } from '../authentication/src/middleware/requireUser.ts';

const habitRouter = express.Router();

habitRouter.get('/', requireUser, habitController.getAllHabits, (req, res) => {
    res.status(200).json(res.locals.habits);
});
habitRouter.get('/:id', requireUser, habitController.getHabitById, (req, res) => {
    res.status(200).json(res.locals.habitsById);
});

habitRouter.post('/', requireUser, habitController.createHabit, (req, res) => {
    res.status(201).json(res.locals.habit)
});

// // PATCH /habits/:id           — update title/goal/frequency/completed
habitRouter.patch('/:id/complete', requireUser, habitController.toggleComplete, (req, res) => { res.status(200).json(res.locals.toggledHabit);
});

// habitRouter.patch('/:id', habitController.updateHabit, (req, res) =>{
//     res.status(204).send({message: 'habit was updated'})
// });

// // PATCH /habits/:id/complete  — toggle completed
// habitRouter.patch('/:id/complete', habitController.toggleComplete, (req, res) => {});

habitRouter.delete('/:id', requireUser, habitController.deleteHabit, (req, res) => {
    res.status(204).send({message:'habit was delted'});
});

export default habitRouter;
