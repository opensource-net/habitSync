interface ProgressSummaryProps {
  totalHabits: number;
  completedHabits: number;
}

export function ProgressSummary({
  totalHabits,
  completedHabits,
}: ProgressSummaryProps) {
  const rate =
    totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  return (
    <section className="panel stats-card">
      <h2 className="panel-title">TODAY&apos;S STATS</h2>

      <div className="stats-table">
        <div className="stats-line">
          <span className="stats-key">TOTAL QUESTS</span>
          <span className="stats-value">{totalHabits}</span>
        </div>

        <div className="stats-line">
          <span className="stats-key">COMPLETED</span>
          <span className="stats-value">{completedHabits}</span>
        </div>

        <div className="stats-line">
          <span className="stats-key">COMPLETION RATE</span>
          <span className="stats-value">{rate}%</span>
        </div>
      </div>

      <div className="stats-progress">
        <div className="stats-progress-track">
          <div
            className="stats-progress-fill"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      {rate === 100 && (
        <p className="stats-success">✓ ALL QUESTS DONE!</p>
      )}
    </section>
  );
}
