import { useState } from 'react';
import type {
  Habit,
  HabitFrequency,
  UpdateHabitValues,
} from '../../features/habits/habits.types';

interface HabitCardProps {
  habit: Habit;
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onEditHabit: (id: string, values: UpdateHabitValues) => void;
}

export function HabitCard({
  habit,
  onToggleHabit,
  onDeleteHabit,
  onEditHabit,
}: HabitCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(habit.title);
  const [goal, setGoal] = useState(habit.goal);
  const [frequency, setFrequency] = useState<HabitFrequency>(habit.frequency);
  const [showXp, setShowXp] = useState(false);

  function handleSave() {
    const trimmedTitle = title.trim();
    const trimmedGoal = goal.trim();

    if (!trimmedTitle || !trimmedGoal) return;

    onEditHabit(habit.id, {
      title: trimmedTitle,
      goal: trimmedGoal,
      frequency,
    });

    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(habit.title);
    setGoal(habit.goal);
    setFrequency(habit.frequency);
    setIsEditing(false);
  }

  function handleToggleClick() {
    if (!habit.completed) {
      setShowXp(true);

      window.setTimeout(() => {
        setShowXp(false);
      }, 1400);
    }

    onToggleHabit(habit.id);
  }

  return (
    <article className="quest-card">
      {showXp && <div className="xp-pop">+10 XP</div>}

      {isEditing ? (
        <div className="stack" style={{ gap: 12 }}>
          <div className="px-form-grid">
            <div className="field">
              <label className="px-label" htmlFor={`edit-title-${habit.id}`}>
                Quest
              </label>
              <input
                id={`edit-title-${habit.id}`}
                type="text"
                className="px-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="px-label" htmlFor={`edit-goal-${habit.id}`}>
                Goal
              </label>
              <input
                id={`edit-goal-${habit.id}`}
                type="text"
                className="px-input"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="px-label" htmlFor={`edit-freq-${habit.id}`}>
                Freq
              </label>
              <select
                id={`edit-freq-${habit.id}`}
                className="px-select"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="actions">
            <button
              type="button"
              className="px-btn"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className="px-btn px-btn-ghost"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="quest-top">
            <div className="quest-main">
              <button
                type="button"
                className={`px-checkbox${habit.completed ? ' checked' : ''}`}
                onClick={handleToggleClick}
                aria-label={habit.completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {habit.completed ? '✓' : ''}
              </button>

              <h3 className="quest-title">{habit.title}</h3>

              <span className="px-badge badge-daily">
                {habit.frequency.toUpperCase()}
              </span>

              <span className="px-badge px-badge-xp">
                +10 XP
              </span>
            </div>

            <div className="actions">
              <button
                type="button"
                className="btn-small edit"
                onClick={() => setIsEditing(true)}
                aria-label="Edit quest"
              >
                ✎
              </button>

              <button
                type="button"
                className="btn-small delete"
                onClick={() => onDeleteHabit(habit.id)}
                aria-label="Delete quest"
              >
                ✕
              </button>
            </div>
          </div>

          <p className="quest-goal">{habit.goal}</p>
        </>
      )}
    </article>
  );
}