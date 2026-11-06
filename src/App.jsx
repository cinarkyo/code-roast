import { useState } from 'react'
import CodePanel from './components/CodePanel'
import './App.css'

function App() {
  const [name1, setName1] = useState('')
  const [code1, setCode1] = useState('')
  const [name2, setName2] = useState('')
  const [code2, setCode2] = useState('')

  const isFormValid =
    name1.trim().length > 0 &&
    code1.trim().length > 0 &&
    name2.trim().length > 0 &&
    code2.trim().length > 0

  const handleRoast = (e) => {
    e.preventDefault()
    if (!isFormValid) return

    console.log({
      name1: name1.trim(),
      code1,
      name2: name2.trim(),
      code2,
    })
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="badge-tag">GIT BLAME ROULETTE</div>
        <h1 className="app-title">Code Roast 🔥</h1>
        <p className="app-slogan">Paste your code. Get destroyed.</p>
      </header>

      <main className="arena-main">
        <form className="roast-form" onSubmit={handleRoast}>
          <div className="panels-grid">
            <CodePanel
              playerNumber={1}
              name={name1}
              onNameChange={setName1}
              code={code1}
              onCodeChange={setCode1}
              namePlaceholder="Player 1"
              codePlaceholder="Paste your code here..."
            />

            <div className="vs-divider" aria-hidden="true">
              <span className="vs-badge">VS</span>
            </div>

            <CodePanel
              playerNumber={2}
              name={name2}
              onNameChange={setName2}
              code={code2}
              onCodeChange={setCode2}
              namePlaceholder="Player 2"
              codePlaceholder="Paste your code here..."
            />
          </div>

          <div className="action-area">
            <button
              type="submit"
              className="roast-button"
              disabled={!isFormValid}
            >
              Roast &apos;em 🔥
            </button>
            <p className="security-warning">
              Don&apos;t paste secrets or API keys.
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}

export default App
