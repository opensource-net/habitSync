import express from 'express';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import { existsSync } from 'fs';
import cookieParser from 'cookie-parser';
import habitRouter from './routers/habitRouter.ts';
import authRoutes from './authentication/src/routes';
import deserializeUser from './authentication/src/middleware/deserializeUser';
import userRouter from './routers/userRouter.ts';



const __dirname = import.meta.dirname;
const PORT = 3434;
const app = express();
const clientDistPath = path.resolve(__dirname, '../client/dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3434'], // Vite dev server
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(clientDistPath));
app.use(deserializeUser as any);

// ── Routes ──────────────────────────────────────────────────────────────────

// app.use('/')
app.use('/users', userRouter)
app.use('/api/habits', habitRouter); // I consider this change important because there are too many variables named habits.

// console.log('Authentication API Routes:');
authRoutes(app as any);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/{*splat}', (_req, res) => {
  if (!existsSync(clientIndexPath)) {return res.status(404).json({ err: 'Client not found' });}
  return res.status(200).sendFile(clientIndexPath);
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const defaultError = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultError, err);
  console.error(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;
