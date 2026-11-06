import { useState, useEffect } from 'react'
import CodePanel from './components/CodePanel'
import MatchSettings from './components/MatchSettings'
import './App.css'

function App() {
  const [name1, setName1] = useState('')
  const [code1, setCode1] = useState('')
  const [name2, setName2] = useState('')
  const [code2, setCode2] = useState('')

  // Turn states: 1 (Dev 1 coding), 2 (Dev 2 coding), 'ready' (Both locked)
  const [currentTurn, setCurrentTurn] = useState(1)

  // Timer states (0 = No Limit, or seconds: 30, 60, 120, 300)
  const [timerDuration, setTimerDuration] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)
  const [timerRunning, setTimerRunning] = useState(false)

  const isMatchStarted =
    currentTurn !== 1 ||
    timerRunning ||
    name1.trim().length > 0 ||
    code1.trim().length > 0

  const handleSelectDuration = (seconds) => {
    setTimerDuration(seconds)
    setTimeLeft(seconds > 0 ? seconds : null)
    setTimerRunning(false)
  }

  const startTimerIfNeeded = () => {
    if (timerDuration > 0 && !timerRunning) {
      setTimerRunning(true)
      if (timeLeft === null) {
        setTimeLeft(timerDuration)
      }
    }
  }

  const handleName1Change = (val) => {
    startTimerIfNeeded()
    setName1(val)
  }

  const handleCode1Change = (val) => {
    startTimerIfNeeded()
    setCode1(val)
  }

  const handleName2Change = (val) => {
    startTimerIfNeeded()
    setName2(val)
  }

  const handleCode2Change = (val) => {
    startTimerIfNeeded()
    setCode2(val)
  }

  const handleLockPlayer1 = () => {
    if (!name1.trim()) setName1('Player 1')
    if (!code1.trim()) {
      setCode1('// Time expired before writing any code!')
    }
    setTimerRunning(false)
    setCurrentTurn(2)
    setTimeLeft(timerDuration > 0 ? timerDuration : null)
  }

  const handleLockPlayer2 = () => {
    if (!name2.trim()) setName2('Player 2')
    if (!code2.trim()) {
      setCode2('// Time expired before writing any code!')
    }
    setTimerRunning(false)
    setCurrentTurn('ready')
    setTimeLeft(null)
  }

  const handleResetMatch = () => {
    setName1('')
    setCode1('')
    setName2('')
    setCode2('')
    setCurrentTurn(1)
    setTimerRunning(false)
    setTimeLeft(timerDuration > 0 ? timerDuration : null)
  }

  useEffect(() => {
    if (!timerRunning || timerDuration === 0 || timeLeft === null) return

    const timerId = setTimeout(() => {
      if (timeLeft <= 1) {
        if (currentTurn === 1) {
          if (!name1.trim()) setName1('Player 1')
          if (!code1.trim()) {
            setCode1('// Time expired before writing any code!')
          }
          setTimerRunning(false)
          setCurrentTurn(2)
          setTimeLeft(timerDuration)
        } else if (currentTurn === 2) {
          if (!name2.trim()) setName2('Player 2')
          if (!code2.trim()) {
            setCode2('// Time expired before writing any code!')
          }
          setTimerRunning(false)
          setCurrentTurn('ready')
          setTimeLeft(null)
        }
      } else {
        setTimeLeft((prev) => prev - 1)
      }
    }, 1000)

    return () => clearTimeout(timerId)
  }, [
    timerRunning,
    timerDuration,
    timeLeft,
    currentTurn,
    name1,
    code1,
    name2,
    code2,
  ])

  const isReadyToRoast =
    currentTurn === 'ready' &&
    name1.trim().length > 0 &&
    code1.trim().length > 0 &&
    name2.trim().length > 0 &&
    code2.trim().length > 0

  const handleRoast = (e) => {
    e.preventDefault()
    if (!isReadyToRoast) return

    console.log({
      name1: name1.trim(),
      code1,
      name2: name2.trim(),
      code2,
    })
  }

  const player1Status = currentTurn === 1 ? 'active' : 'locked'
  const player2Status =
    currentTurn === 1 ? 'waiting' : currentTurn === 2 ? 'active' : 'locked'

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="badge-tag">GIT BLAME ROULETTE</div>
        <h1 className="app-title">Code Roast 🔥</h1>
        <p className="app-slogan">Paste your code. Get destroyed.</p>
      </header>

      <main className="arena-main">
        <MatchSettings
          timerDuration={timerDuration}
          onSelectDuration={handleSelectDuration}
          currentTurn={currentTurn}
          isMatchStarted={isMatchStarted}
          onResetMatch={handleResetMatch}
        />

        <form className="roast-form" onSubmit={handleRoast}>
          <div className="panels-grid">
            <CodePanel
              playerNumber={1}
              status={player1Status}
              name={name1}
              onNameChange={handleName1Change}
              code={code1}
              onCodeChange={handleCode1Change}
              onLockIn={handleLockPlayer1}
              timerDuration={timerDuration}
              timeLeft={currentTurn === 1 ? timeLeft : null}
              timerRunning={currentTurn === 1 && timerRunning}
              namePlaceholder="Player 1"
              codePlaceholder="Paste your code here..."
            />

            <div className="vs-divider" aria-hidden="true">
              <span
                className={`vs-badge ${
                  currentTurn === 'ready' ? 'vs-badge-ready' : ''
                }`}
              >
                VS
              </span>
            </div>

            <CodePanel
              playerNumber={2}
              status={player2Status}
              name={name2}
              onNameChange={handleName2Change}
              code={code2}
              onCodeChange={handleCode2Change}
              onLockIn={handleLockPlayer2}
              timerDuration={timerDuration}
              timeLeft={currentTurn === 2 ? timeLeft : null}
              timerRunning={currentTurn === 2 && timerRunning}
              namePlaceholder="Player 2"
              codePlaceholder="Paste your code here..."
            />
          </div>

          <div className="action-area">
            <button
              type="submit"
              className={`roast-button ${isReadyToRoast ? 'ready-pulse' : ''}`}
              disabled={!isReadyToRoast}
            >
              {isReadyToRoast
                ? "Roast 'em 🔥"
                : currentTurn === 1
                ? 'Waiting for Dev 1 to Lock In...'
                : 'Waiting for Dev 2 to Lock In...'}
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
