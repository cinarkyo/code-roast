const TIMER_OPTIONS = [
  { label: 'No Limit', value: 0 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '2m', value: 120 },
  { label: '5m', value: 300 },
]

function MatchSettings({
  timerDuration,
  onSelectDuration,
  currentTurn,
  isMatchStarted,
  onResetMatch,
}) {
  return (
    <div className="match-settings-bar">
      <div className="turn-status">
        <span className="status-dot" data-state={currentTurn} />
        {currentTurn === 1 && (
          <span className="turn-label">
            Turn 1: <strong>Dev 1</strong> is coding
          </span>
        )}
        {currentTurn === 2 && (
          <span className="turn-label">
            Turn 2: <strong>Dev 2</strong> is coding
          </span>
        )}
        {currentTurn === 'ready' && (
          <span className="turn-label turn-ready-text">
            Both codes locked &mdash; <strong>Ready to Roast!</strong>
          </span>
        )}
      </div>

      <div className="settings-controls">
        <div className="timer-selector" role="group" aria-label="Turn time limit">
          <span className="settings-label">⏱️ Turn Timer:</span>
          <div className="timer-pills">
            {TIMER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`timer-pill ${
                  timerDuration === option.value ? 'active' : ''
                }`}
                onClick={() => onSelectDuration(option.value)}
                disabled={isMatchStarted}
                title={
                  isMatchStarted
                    ? 'Reset match to change timer settings'
                    : `Set turn limit to ${option.label}`
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {isMatchStarted && (
          <button
            type="button"
            className="reset-match-btn"
            onClick={onResetMatch}
          >
            ↺ Reset
          </button>
        )}
      </div>
    </div>
  )
}

export default MatchSettings
