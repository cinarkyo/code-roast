import { useEffect, useRef, useState } from 'react'
import './ResultView.css'

const COPY_LABEL_MS = 2000
const COPY_IDLE_LABEL = 'Copy result'

function ResultCard({ name, roast, isLoser }) {
  return (
    <article className={`result-card ${isLoser ? 'result-card--loser' : 'result-card--winner'}`}>
      <header className="result-card-header">
        <h3 className="result-name">{name}</h3>
        {isLoser && <span className="result-badge">LOSER</span>}
      </header>
      <p className="result-roast">{roast}</p>
    </article>
  )
}

function ResultView({ result, name1, name2, onReset }) {
  const [copyLabel, setCopyLabel] = useState(COPY_IDLE_LABEL)
  const copyTimer = useRef(null)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  // The API returns the loser's name, so exactly one card must be derived from it.
  const isFirstLoser = result.loser.trim() === name1.trim()

  const showCopyLabel = (label) => {
    setCopyLabel(label)
    clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopyLabel(COPY_IDLE_LABEL), COPY_LABEL_MS)
  }

  const handleCopy = async () => {
    const summary = [
      `Code Roast 🔥 ${name1} vs ${name2}`,
      `Loser: ${result.loser}`,
      result.verdict,
      window.location.origin,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(summary)
      showCopyLabel('Copied!')
    } catch {
      showCopyLabel('Copy failed')
    }
  }

  return (
    <section className="result-view" aria-label="Roast result">
      <div className="result-cards">
        <ResultCard name={name1} roast={result.roast1} isLoser={isFirstLoser} />
        <ResultCard name={name2} roast={result.roast2} isLoser={!isFirstLoser} />
      </div>

      <p className="result-verdict">{result.verdict}</p>

      <div className="result-actions">
        <button type="button" className="result-copy" aria-live="polite" onClick={handleCopy}>
          {copyLabel}
        </button>
        <button type="button" className="result-reset" onClick={onReset}>
          Roast again
        </button>
      </div>
    </section>
  )
}

export default ResultView
