import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3434';

export interface SessionUser {
  email: string;
  name: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface SessionData {
  sessionId: string;
  email: string;
  valid: boolean;
  name: string;
}

export interface SignupData {
  user_id: string;
  email: string;
}

export async function login(
  email: string,
  password: string,
): Promise<SessionData> {
  const response = await axios.post<SessionData>(
    `${API_BASE_URL}/api/session`,
    { email, password },
    { withCredentials: true },
  );

  return response.data;
}

export async function signup(
  userId: string,
  email: string,
  password: string,
): Promise<SignupData> {
  const response = await axios.post<SignupData>(
    `${API_BASE_URL}/api/users`,
    { user_id: userId, email, password },
    { withCredentials: true },
  );

  return response.data;
}

export async function getSession(): Promise<SessionUser> {
  const response = await axios.get<SessionUser>(`${API_BASE_URL}/api/session`, {
    withCredentials: true,
  });

  return response.data;
}

export async function logout(): Promise<SessionData> {
  const response = await axios.delete<SessionData>(
    `${API_BASE_URL}/api/session`,
    {
      withCredentials: true,
    },
  );

  return response.data;
}
