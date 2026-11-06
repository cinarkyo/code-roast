function CodePanel({
  playerNumber,
  name,
  onNameChange,
  code,
  onCodeChange,
  namePlaceholder = `Player ${playerNumber}`,
  codePlaceholder = 'Paste your code here...',
}) {
  return (
    <div className="code-panel">
      <div className="panel-header">
        <div className="window-dots" aria-hidden="true">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="panel-badge">DEV {playerNumber}</span>
      </div>

      <div className="panel-body">
        <div className="field-group">
          <div className="field-label-row">
            <label htmlFor={`player-name-${playerNumber}`} className="field-label">
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
            <label htmlFor={`player-code-${playerNumber}`} className="field-label">
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
      </div>
    </div>
  )
}

export default CodePanel
