import { Request, Response, NextFunction } from 'express';

import { supabase } from '../supabaseClient.ts';


const userController = {
    //does user exist? if yes go to log in and get user
    getUser: async(req:Request, res:Response, next:NextFunction) => {
        try {
            const { user_id, password } = req.query;
            //hash with bcrypt?
            //possibly change this to check for jwtoken?
            if (!user_id || typeof user_id !== 'string' || !password) {
                 return next({log: 'err in postUser', status:400, message: {err: 'check userid and password'} });
            }
            const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', {ascending: false})
            .select()

            if (error) {return next({log: error.message,  status: 500, message: { err: 'data not found' } });}
            res.locals.habits = data;
            return next()
        } catch (err) {
            return next({
            log: 'error in postUser',
            status: 500,
            message: {err: 'error message'}
            });
        }
    },
    createUser: async(req:Request, res:Response, next:NextFunction) => {
            try {
              const { user_id, password, email } = req.body;
              //this might be where JWT would check too
              if (!user_id || !password) {
                res.status(400).json({ error: 'user_id, title, goal, and frequency are required' });
                return;
              }
              const { data, error } = await supabase
                .from('users')
                .insert( { user_id, password, email})
                .select()
              if (error) { return next({ log: error.message, status: 500, message: { err: error.message } }); }
              res.locals.user = data;
              return next();      
            } catch (err) {
              return next({
                log: 'error in postHabit',
                status: 400,
                message: {err: 'error message'}
              });
            }
          },
    // updateUser: async(req:Request, res:Response, next:NextFunction) => {},
    deleteUser: async(req:Request, res:Response, next:NextFunction) => {
        console.log('inside delte user')
    }
}

export default userController;