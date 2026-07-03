import { Request, Response } from 'express';
import {
  createSession,
  createUser,
  getUser,
  invalidateSession,
} from '../db/database';
import { signJWT, verifyJWT } from '../utils/jwt.utils';

// login handler
export async function createSessionHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    const normalizedPassword =
      typeof password === 'string' ? password.trim() : '';

    if (!normalizedEmail || !normalizedPassword) {
      return res.status(400).send('Email and password are required');
    }

    const user = await getUser(normalizedEmail);

    if (!user || user.password !== normalizedPassword) {
      return res.status(401).send('Invalid email or password');
    }

    const session = createSession(user.email, user.user_id);

    // create access token
    const accessToken = signJWT(
      { email: user.email, name: user.user_id, sessionId: session.sessionId },
      '15m',
    );

    const refreshToken = signJWT({ sessionId: session.sessionId }, '1y');

    // set access token in cookie
    res.cookie('accessToken', accessToken, {
      maxAge: 300000, // 5 minutes
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 300000, // 1 year
      httpOnly: true,
    });
    // res.cookie('refreshToken', refreshToken, {
    //   maxAge: 3.154e10, // 1 year
    //   httpOnly: true,
    // });

    // send user back
    return res.send(session);
  } catch (error) {
    console.error('Error creating session', error);
    return res.status(500).send('Failed to create session');
  }
}

// get the session session

export async function createUserHandler(req: Request, res: Response) {
  try {
    const { email, password, user_id, username } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    const normalizedPassword =
      typeof password === 'string' ? password.trim() : '';
    const normalizedUserId =
      typeof user_id === 'string' && user_id.trim()
        ? user_id.trim()
        : typeof username === 'string'
          ? username.trim()
          : '';

    if (!normalizedEmail || !normalizedPassword || !normalizedUserId) {
      return res
        .status(400)
        .send('user_id, email, and password are required');
    }

    const existingUser = await getUser(normalizedEmail);

    if (existingUser) {
      return res.status(409).send('Email already exists');
    }

    const user = await createUser(
      normalizedUserId,
      normalizedEmail,
      normalizedPassword,
    );

    return res.status(201).json({ user_id: user.user_id, email: user.email });
  } catch (error) {
    console.error('Error creating user', error);
    return res.status(500).send('Failed to create user');
  }
}

// log out handler
export function getSessionHandler(req: Request, res: Response) {
  // @ts-ignore
  return res.send(req.user);
}

export function deleteSessionHandler(req: Request, res: Response) {
  res.cookie('accessToken', '', {
    maxAge: 0,
    httpOnly: true,
  });

  res.cookie('refreshToken', '', {
    maxAge: 0,
    httpOnly: true,
  });

  // invalidate only if session exists
  // @ts-ignore
  if (req.user?.sessionId) {
    // @ts-ignore
    const session = invalidateSession(req.user.sessionId);
    return res.send(session);
  }

  return res.status(200).send({ message: 'Logged out' });
}
