import { Express } from 'express';
import {
  createSessionHandler,
  createUserHandler,
  getSessionHandler,
  deleteSessionHandler,
} from './controllers/session.controller';
import { requireUser } from './middleware/requireUser';

function authRoutes(app: Express) {
  // signup
  app.post('/api/users', createUserHandler);
  // login
  app.post('/api/session', createSessionHandler);
  // get the current session

  app.get('/api/session', requireUser, getSessionHandler);
  // logout
  app.delete('/api/session', deleteSessionHandler);
}

export default authRoutes;
