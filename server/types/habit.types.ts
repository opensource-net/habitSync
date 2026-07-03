// Mirror of client/src/features/habits/habits.types.ts
export type HabitFrequency = 'daily' | 'weekly';

export type Habit = {
  id: string;
  user_id: string;      // FK to auth.users
  title: string;
  goal: string;
  frequency: HabitFrequency;
  completed: boolean;
  created_at?: Date;
};

export type CreateHabitBody = {
  user_id: string;
  title: string;
  goal: string;
  frequency: HabitFrequency;
};

export type UpdateHabitBody = {
  title?: string;
  goal?: string;
  frequency?: HabitFrequency;
  completed?: boolean;
};
