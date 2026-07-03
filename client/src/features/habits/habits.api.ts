import axios from 'axios';
import type { Habit, HabitFrequency } from './habits.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3434';

export interface CreateHabitPayload {
  title: string;
  goal: string;
  frequency: HabitFrequency;
}

export async function getHabits(): Promise<Habit[]> {
  const response = await axios.get<Habit[]>(
    `${API_BASE_URL}/api/habits?t=${Date.now()}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
}

export async function createHabit(
  payload: CreateHabitPayload,
): Promise<Habit[]> {
  const response = await axios.post<Habit[]>(
    `${API_BASE_URL}/api/habits`,
    payload,
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function toggleHabitRequest(id: string): Promise<Habit> {
  const response = await axios.patch<Habit>(
    `${API_BASE_URL}/api/habits/${id}/complete`,
    {},
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function deleteHabitRequest(id: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/api/habits/${id}`, {
    withCredentials: true,
  });
}