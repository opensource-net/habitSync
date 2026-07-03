import { useState } from 'react';
import type { FormEvent } from 'react';
import type { HabitFrequency } from '../../features/habits/habits.types';

interface HabitFormValues {
  title: string;
  goal: string;
  frequency: HabitFrequency;
}

interface HabitFormProps {
  onCreateHabit: (values: HabitFormValues) => void;
}

export function HabitForm({ onCreateHabit }: HabitFormProps) {
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const t = title.trim();
    const g = goal.trim();
    if (!t || !g) return;
    onCreateHabit({ title: t, goal: g, frequency });
    setTitle('');
    setGoal('');
    setFrequency('daily');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="px-border"
      style={{
        background: 'var(--px-panel)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Title bar */}
      <div style={{ borderBottom: '2px solid var(--px-border)', paddingBottom: 10 }}>
        <h2
          className="font-pixel"
          style={{ fontSize: 8, color: 'var(--px-primary)', lineHeight: 1.8 }}
        >
          + NEW QUEST
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
        <div>
          <label className="px-label" htmlFor="habit-title">QUEST NAME</label>
          <input
            id="habit-title"
            type="text"
            className="px-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Drink water"
            required
          />
        </div>

        <div>
          <label className="px-label" htmlFor="habit-goal">GOAL</label>
          <input
            id="habit-goal"
            type="text"
            className="px-input"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Stay hydrated"
            required
          />
        </div>

        <div>
          <label className="px-label" htmlFor="habit-freq">FREQ</label>
          <select
            id="habit-freq"
            className="px-select"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
            style={{ width: 'auto', minWidth: 110 }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="px-btn px-btn-primary"
        style={{ alignSelf: 'flex-start' }}
      >
        ⚔ ADD QUEST
      </button>
    </form>
  );
}
