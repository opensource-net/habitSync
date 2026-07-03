import { HabitCard } from './HabitCard';
import type { Habit, UpdateHabitValues } from '../../features/habits/habits.types';

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onEditHabit: (id: string, values: UpdateHabitValues) => void;
}

export function HabitList({
  habits,
  onToggleHabit,
  onDeleteHabit,
  onEditHabit,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="panel">
        <div className="stack" style={{ alignItems: 'center', padding: '12px 0' }}>
          <span style={{ fontSize: 48 }}>📜</span>
          <p
            className="font-pixel"
            style={{
              fontSize: 9,
              textAlign: 'center',
              color: 'var(--muted)',
            }}
          >
            No quests yet.
            <br />
            Add your first quest above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="quest-list">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggleHabit={onToggleHabit}
          onDeleteHabit={onDeleteHabit}
          onEditHabit={onEditHabit}
        />
      ))}
    </div>
  );
}
