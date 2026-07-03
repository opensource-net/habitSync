import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HabitForm } from '../components/habits/HabitForm';
import { HabitList } from '../components/habits/HabitList';
import { PetStageCard } from '../components/pet/PetStageCard';
import { ProgressSummary } from '../components/progress/ProgressSummary';
import { getHabits, createHabit, deleteHabitRequest, toggleHabitRequest } from '../features/habits/habits.api';
import type {
  Habit,
  HabitFrequency,
  UpdateHabitValues,
} from '../features/habits/habits.types';

type HabitFormValues = {
  title: string;
  goal: string;
  frequency: HabitFrequency;
};

interface LayoutContext {
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
}

//const HABITS_STORAGE_KEY = 'habit-tracker-habits';

export default function DashboardPage() {
  const { setXp } = useOutletContext<LayoutContext>();

  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
  async function loadHabits() {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      console.error('Failed to load habits:', error);
    }
  }

  loadHabits();
}, []);

  const completedCount = useMemo(
    () => habits.filter((h) => h.completed).length,
    [habits]
  );

  // const derivedXp = completedCount * 10;

  useEffect(() => {
  setXp(completedCount * 10);
}, [completedCount, setXp]);

  async function handleCreate(values: HabitFormValues) {
  try {
    await createHabit({
      title: values.title,
      goal: values.goal,
      frequency: values.frequency,
    });

    const updatedHabits = await getHabits();
    setHabits(updatedHabits);
  } catch (error) {
    console.error('Failed to create habit:', error);
  }
}

 async function handleToggle(id: string) {
  let wasCompleted = false;

  setHabits((prev) =>
    prev.map((h) => {
      if (h.id !== id) return h;
      wasCompleted = h.completed;
      return { ...h, completed: !h.completed };
    })
  );

  try {
    await toggleHabitRequest(id);
  } catch (error) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, completed: wasCompleted } : h
      )
    );

    console.error('Failed to toggle habit:', error);
  }
}

async function handleDelete(id: string) {
  try {
    await deleteHabitRequest(id);

    setHabits(prev => prev.filter(h => h.id !== id));
  } catch (error) {
    console.error('Failed to delete habit:', error);
  }
}

  function handleEdit(id: string, values: UpdateHabitValues) {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...values } : h))
    );
  }

  return (
    <div className="page">
      <div className="shell">
        <div>
          <h1 className="page-title font-pixel">DASHBOARD</h1>
          <p className="page-subtitle font-pixel">
            Today&apos;s quests — stay consistent, hero.
          </p>
        </div>

        <div className="grid">
          <div className="stack">
            <PetStageCard completedHabitsCount={completedCount} />
            <ProgressSummary
              totalHabits={habits.length}
              completedHabits={completedCount}
            />
          </div>

          <div className="stack">
            <HabitForm onCreateHabit={handleCreate} />

            <section className="quests-panel">
              <div className="quest-section-head">
                <span className="orb" />
                <h2 className="panel-title">QUEST LOG</h2>
                <span className="trail" />
              </div>

              <HabitList
                habits={habits}
                onToggleHabit={handleToggle}
                onDeleteHabit={handleDelete}
                onEditHabit={handleEdit}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
