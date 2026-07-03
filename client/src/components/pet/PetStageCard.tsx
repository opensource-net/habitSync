import tinyImg from '../../assets/pet/tinyPup1.png';
import puppyImg from '../../assets/pet/pup1png.png';
import dogImg from '../../assets/pet/dog1.png';

interface PetStageCardProps {
  completedHabitsCount: number;
}

interface PetStage {
  label: string;
  image: string;
  xpNeeded: number;
  color: string;
  scale: number
}

const PET_STAGES: PetStage[] = [
  { label: 'TINY PUP', image: tinyImg, xpNeeded: 5, color: 'var(--muted)', scale: 4.2 },
  { label: 'PUPPY', image: puppyImg, xpNeeded: 10, color: 'var(--cyan-dark)', scale: 4.0 },
  { label: 'DOG', image: dogImg, xpNeeded: 999, color: 'var(--gold-dark)', scale: 3.8 },
];

function getPetStage(count: number): PetStage {
  if (count >= 10) return PET_STAGES[2];
  if (count >= 5) return PET_STAGES[1];
  return PET_STAGES[0];
}

export function PetStageCard({ completedHabitsCount }: PetStageCardProps) {
  const stage = getPetStage(completedHabitsCount);
  const nextStage = PET_STAGES.find((s) => s.xpNeeded > completedHabitsCount);

  const progress = nextStage
    ? Math.min((completedHabitsCount / nextStage.xpNeeded) * 100, 100)
    : 100;

  const habitsLeft = nextStage
    ? Math.max(nextStage.xpNeeded - completedHabitsCount, 0)
    : 0;

  return (
    <section className="panel">
      <h2 className="panel-title">PET COMPANION</h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          padding: '8px 0 6px',
        }}
      >
        <div className="pet-image-wrap">
          <img
            src={stage.image}
            alt={stage.label}
            className="pet-image"
           
          />
        </div>

        <span
          className="px-badge pet-name"
          style={{
            color: stage.color,
            borderColor: 'var(--line-dark)',
          }}
        >
          {stage.label}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 6,
          marginBottom: 8,
        }}
      >
        <span
          className="font-pixel"
          style={{ fontSize: 8, color: 'var(--ink)' }}
        >
          PROGRESS
        </span>

        <span
          className="font-pixel"
          style={{ fontSize: 8, color: 'var(--ink)' }}
        >
          {completedHabitsCount} / {nextStage?.xpNeeded ?? '∞'}
        </span>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p
        className="font-pixel"
        style={{
          fontSize: 7,
          color: 'var(--muted)',
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        {nextStage ? `${habitsLeft} habits to evolve` : 'MAX EVOLUTION'}
      </p>
    </section>
  );
}