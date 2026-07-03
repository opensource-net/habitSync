import { Request, Response, NextFunction } from 'express';
import type { CreateHabitBody, UpdateHabitBody } from '../types/habit.types.ts';
import '../authentication/src/controllers/session.controller'
import { supabase } from '../supabaseClient.ts';

const habitController = {
  getAllHabits: async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.user?.name;

    if (!userId) {
      return next({
        log: 'missing user in session',
        status: 403,
        message: { err: 'Invalid session' },
      });
    }

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return next({
        log: error.message,
        status: 500,
        message: { err: error.message },
      });
    }

    res.locals.habits = data;
    return next();
  } catch (err) {
    return next({
      log: 'error in getAllHabits',
      status: 500,
      message: { err: 'error message' },
    });
  }
},

  getHabitById: async (req: Request, res: Response, next: NextFunction) => {
    //create habit type?
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {return next({ log: error.message, status: 404, message: { err: 'Habit not found' } });}
      res.locals.habitsById = data;
      return next ()
    } catch (err) {
      next(err);
    }
    return  next({
      log: 'error in getHabitById',
      status: 500,
      message: {err: 'error possibly bad id?'}
    })
  },

  createHabit: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, goal, frequency } = req.body;

    // @ts-ignore
    const userId = req.user?.name;

    if (!userId || !title || !goal || !frequency) {
      res
        .status(400)
        .json({ error: 'title, goal, and frequency are required' });
      return;
    }

    if (!['daily', 'weekly'].includes(frequency)) {
      res
        .status(400)
        .json({ error: 'frequency must be "daily" or "weekly"' });
      return;
    }

    const { data, error } = await supabase
      .from('habits')
      .insert({ user_id: userId, title, goal, frequency, completed: false })
      .select();

    if (error) {
      return next({
        log: error.message,
        status: 500,
        message: { err: error.message },
      });
    }

    res.locals.habit = data;
    return next();
  } catch (err) {
    return next({
      log: 'error in postHabit',
      status: 400,
      message: { err: 'error message' },
    });
  }
},

toggleComplete: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { data: existing, error: fetchError } = await supabase
      .from('habits')
      .select('completed')
      .eq('id', id)
      .single();

    if (fetchError) {
      return next({
        log: fetchError.message,
        status: 404,
        message: 'Habit not found',
      });
    }

    const { data, error } = await supabase
      .from('habits')
      .update({ completed: !existing.completed })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return next({
        log: error.message,
        status: 500,
        message: error.message,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
},


    // console.log("update Habit? ran")
    // return next();
//     try {
//       const { id } = req.params;
//       const updates = req.body as UpdateHabitBody;

//       if (updates.frequency && !['daily', 'weekly'].includes(updates.frequency)) {
//         res.status(400).json({ error: 'frequency must be "daily" or "weekly"' });
//         return;
//       }

//       // TODO: replace with supabase query
//       // const { data, error } = await supabase
//       //   .from('habits')
//       //   .update(updates)
//       //   .eq('id', id)
//       //   .select()
//       //   .single();
//       // if (error) return next({ log: error.message, status: 404, message: { err: 'Habit not found' } });
//       // res.status(200).json(data);

//       res.status(200).json({ id, ...updates });
//     } catch (err) {
//       next(err);
//     }
  // },

//   // PATCH /habits/:id/complete — toggles completed
  toggleComplete: async (req: Request, res: Response, next: NextFunction) => {
    console.log("toggle ran")

    return next();
//     try {
//       const { id } = req.params;

//       // TODO: replace with supabase query (fetch current state, then toggle)
//       // const { data: existing, error: fetchError } = await supabase
//       //   .from('habits').select('completed').eq('id', id).single();
//       // if (fetchError) return next({ log: fetchError.message, status: 404, message: { err: 'Habit not found' } });
//       // const { data, error } = await supabase
//       //   .from('habits').update({ completed: !existing.completed }).eq('id', id).select().single();
//       // if (error) return next({ log: error.message, status: 500, message: { err: error.message } });
//       // res.status(200).json(data);

//       res.status(200).json({ id, completed: true });
//     } catch (err) {
//       next(err);
//     }
  },
  deleteHabit: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // @ts-ignore
    const userId = req.user?.name;

    if (!userId) {
      return next({
        log: 'missing user in session',
        status: 403,
        message: { err: 'Invalid session' },
      });
    }

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return next({
        log: error.message,
        status: 404,
        message: { err: 'Habit not found' },
      });
    }

    return next();
  } catch (err) {
    return next(err);
  }
},
}

export default habitController;
