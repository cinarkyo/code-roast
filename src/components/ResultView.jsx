import './ResultView.css'

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
  // The API returns the loser's name, so exactly one card must be derived from it.
  const isFirstLoser = result.loser.trim() === name1.trim()

  return (
    <section className="result-view" aria-label="Roast result">
      <div className="result-cards">
        <ResultCard name={name1} roast={result.roast1} isLoser={isFirstLoser} />
        <ResultCard name={name2} roast={result.roast2} isLoser={!isFirstLoser} />
      </div>

      <p className="result-verdict">{result.verdict}</p>

      <button type="button" className="result-reset" onClick={onReset}>
        Roast again
      </button>
    </section>
  )
}

export default ResultView
