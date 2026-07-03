export type HabitFrequency = 'daily' | 'weekly';

export type Habit = {
  id: string;
  title: string;
  goal: string;
  frequency: HabitFrequency;
  completed: boolean;
};

export type UpdateHabitValues = {
  title: string;
  goal: string;
  frequency: HabitFrequency;
};