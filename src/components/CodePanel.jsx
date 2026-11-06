function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function CodePanel({
  playerNumber,
  status, // 'active' | 'waiting' | 'locked'
  name,
  onNameChange,
  code,
  onCodeChange,
  onLockIn,
  timerDuration,
  timeLeft,
  timerRunning,
  namePlaceholder = `Player ${playerNumber}`,
  codePlaceholder = 'Paste your code here...',
}) {
  const canLock = name.trim().length > 0 && code.trim().length > 0
  const lineCount = code ? code.split('\n').length : 0
  const isTimerCritical = timerDuration > 0 && timeLeft !== null && timeLeft <= 10

  return (
    <div className={`code-panel panel-${status}`}>
      <div className="panel-header">
        <div className="window-dots" aria-hidden="true">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>

        <div className="panel-header-center">
          <span className={`panel-badge badge-${status}`}>
            {status === 'locked' && '🔒 '}
            {status === 'active' && '⚡ '}
            {status === 'waiting' && '⏳ '}
            DEV {playerNumber}
          </span>

          {status === 'active' && timerDuration > 0 && timeLeft !== null && (
            <span
              className={`panel-timer ${timerRunning ? 'running' : ''} ${
                isTimerCritical ? 'critical' : ''
              }`}
              title={
                timerRunning
                  ? 'Time remaining for this turn'
                  : 'Timer starts as soon as you type'
              }
            >
              ⏱️ {formatTime(timeLeft)}
              {!timerRunning && <small className="timer-hint"> (type to start)</small>}
            </span>
          )}
        </div>

        <span className={`status-pill pill-${status}`}>
          {status === 'active' && 'ACTIVE TURN'}
          {status === 'waiting' && 'STANDBY'}
          {status === 'locked' && 'SEALED'}
        </span>
      </div>

      {status === 'active' && (
        <div className="panel-body">
          <div className="field-group">
            <div className="field-label-row">
              <label
                htmlFor={`player-name-${playerNumber}`}
                className="field-label"
              >
                Developer Name
              </label>
              <span className="char-count">{name.length}/30</span>
            </div>
            <input
              id={`player-name-${playerNumber}`}
              type="text"
              className="name-input"
              maxLength={30}
              placeholder={namePlaceholder}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="field-group code-field-group">
            <div className="field-label-row">
              <label
                htmlFor={`player-code-${playerNumber}`}
                className="field-label"
              >
                Code Snippet
              </label>
              <span className="char-count">{code.length}/4000</span>
            </div>
            <textarea
              id={`player-code-${playerNumber}`}
              className="code-textarea"
              maxLength={4000}
              placeholder={codePlaceholder}
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />
          </div>

          <button
            type="button"
            className="lock-in-button"
            disabled={!canLock}
            onClick={onLockIn}
          >
            <span className="lock-btn-icon" aria-hidden="true">
              🔒
            </span>
            {playerNumber === 1
              ? 'Lock In & Pass to Dev 2'
              : 'Lock In Code'}
          </button>
        </div>
      )}

      {status === 'locked' && (
        <div className="panel-vault" aria-label={`Developer ${playerNumber} code is locked and hidden`}>
          <div className="vault-hazard-strip" aria-hidden="true" />

          <div className="vault-content">
            <div className="vault-chains" aria-hidden="true">
              <span className="chain-line chain-left" />
              <span className="chain-line chain-right" />
            </div>

            <div className="padlock-badge" aria-hidden="true">
              <svg
                className="padlock-svg"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 28V20C20 13.3726 25.3726 8 32 8C38.6274 8 44 13.3726 44 20V28"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <rect
                  x="12"
                  y="28"
                  width="40"
                  height="28"
                  rx="6"
                  fill="rgba(249, 115, 22, 0.15)"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <circle cx="32" cy="40" r="3.5" fill="currentColor" />
                <path
                  d="M32 43.5V49"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="vault-title">CODE LOCKED &amp; HIDDEN</h3>
            <p className="vault-player-name">{name.trim() || `Player ${playerNumber}`}</p>

            <div className="vault-stats">
              <span className="vault-stat-chip">
                {lineCount} {lineCount === 1 ? 'line' : 'lines'}
              </span>
              <span className="vault-stat-divider">&bull;</span>
              <span className="vault-stat-chip">{code.length} chars</span>
            </div>

            <div className="redacted-preview" aria-hidden="true">
              <div className="redacted-line w-75" />
              <div className="redacted-line w-50 indent-1" />
              <div className="redacted-line w-85 indent-2" />
              <div className="redacted-line w-60 indent-2" />
              <div className="redacted-line w-40 indent-1" />
              <div className="redacted-line w-30" />
            </div>

            <span className="vault-stamp">CLASSIFIED UNTIL ROAST</span>
          </div>

          <div className="vault-hazard-strip" aria-hidden="true" />
        </div>
      )}

      {status === 'waiting' && (
        <div className="panel-waiting">
          <div className="waiting-content">
            <div className="waiting-icon-circle" aria-hidden="true">
              ⏳
            </div>
            <h3 className="waiting-title">Waiting for Dev 1</h3>
            <p className="waiting-desc">
              Dev 1 is currently writing their code. Once they lock it in, it
              will be hidden and your turn will begin.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodePanel
