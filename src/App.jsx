import { useState, useEffect } from 'react'
import CodePanel from './components/CodePanel'
import MatchSettings from './components/MatchSettings'
import ResultView from './components/ResultView'
import { roastCode } from './services/roastClient'
import './App.css'

const TIME_EXPIRED_CODE = '// Time expired before writing any code!'

const LOADING_MESSAGES = [
  'Reading your spaghetti…',
  'Counting your nested ifs…',
  'Questioning your variable names…',
  'Checking git blame for who hurt you…',
  'Consulting burned-out senior architects…',
  'Measuring cyclomatic complexity…',
  'Searching Stack Overflow for where you copied this…',
  'Preparing emotional damage…',
]

function normalizeName(name) {
  return name.trim().toLowerCase().replace(/\u0307/g, '').replace(/ı/g, 'i')
}

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

  // API & UI states
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  // Players whose panels reopened after a failed roast, in lock-in order
  const [unlockedPlayers, setUnlockedPlayers] = useState([])
  const isEditingAfterError = unlockedPlayers.length > 0
  const visibleTurn = isEditingAfterError ? unlockedPlayers[0] : currentTurn

  const hasDuplicateNames =
    name1.trim().length > 0 &&
    name2.trim().length > 0 &&
    normalizeName(name1) === normalizeName(name2)

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
    if (!isEditingAfterError && timerDuration > 0 && !timerRunning) {
      setTimerRunning(true)
      if (timeLeft === null) {
        setTimeLeft(timerDuration)
      }
    }
  }

  const handleName1Change = (val) => {
    startTimerIfNeeded()
    setName1(val)
    if (error && !isEditingAfterError) setError(null)
  }

  const handleCode1Change = (val) => {
    startTimerIfNeeded()
    setCode1(val)
  }

  const handleName2Change = (val) => {
    startTimerIfNeeded()
    setName2(val)
    if (error && !isEditingAfterError) setError(null)
  }

  const handleCode2Change = (val) => {
    startTimerIfNeeded()
    setCode2(val)
  }

  const handleRelockPlayer = (player) => {
    if (hasDuplicateNames) {
      setError('Developer names must be different. Please pick another name.')
      return
    }

    const stillUnlocked = unlockedPlayers.filter((p) => p !== player)
    setUnlockedPlayers(stillUnlocked)
    if (stillUnlocked.length === 0) setError(null)
  }

  const handleLockPlayer1 = () => {
    if (isEditingAfterError) {
      handleRelockPlayer(1)
      return
    }

    if (!name1.trim()) setName1('Player 1')
    if (!code1.trim()) {
      setCode1(TIME_EXPIRED_CODE)
    }
    setTimerRunning(false)
    setCurrentTurn(2)
    setTimeLeft(timerDuration > 0 ? timerDuration : null)
  }

  const handleLockPlayer2 = () => {
    if (isEditingAfterError) {
      handleRelockPlayer(2)
      return
    }

    const finalName1 = name1.trim() || 'Player 1'
    let finalName2 = name2.trim() || 'Player 2'

    // If user explicitly typed the exact same name as Dev 1, block lock-in and show error
    if (name2.trim() && normalizeName(finalName1) === normalizeName(finalName2)) {
      setError('Developer names must be different. Please pick another name.')
      return
    }

    // If fallback default 'Player 2' collided because Dev 1 named themselves 'Player 2'
    if (!name2.trim() && normalizeName(finalName1) === normalizeName(finalName2)) {
      finalName2 = 'Player 2 (Challenger)'
    }

    setName2(finalName2)
    if (!code2.trim()) {
      setCode2(TIME_EXPIRED_CODE)
    }
    setError(null)
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
    setUnlockedPlayers([])
    setTimerRunning(false)
    setTimeLeft(timerDuration > 0 ? timerDuration : null)
    setError(null)
    setResult(null)
    setIsLoading(false)
    setLoadingMsgIndex(0)
  }

  // Countdown timer effect for turns
  useEffect(() => {
    if (!timerRunning || timerDuration === 0 || timeLeft === null) return

    const timerId = setTimeout(() => {
      if (timeLeft <= 1) {
        if (currentTurn === 1) {
          if (!name1.trim()) setName1('Player 1')
          if (!code1.trim()) {
            setCode1(TIME_EXPIRED_CODE)
          }
          setTimerRunning(false)
          setCurrentTurn(2)
          setTimeLeft(timerDuration)
        } else if (currentTurn === 2) {
          const finalName1 = name1.trim() || 'Player 1'
          let finalName2 = name2.trim() || 'Player 2'
          if (normalizeName(finalName1) === normalizeName(finalName2)) {
            finalName2 = `${finalName2} 2`
          }
          setName2(finalName2)
          if (!code2.trim()) {
            setCode2(TIME_EXPIRED_CODE)
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

  // Rotating funny loading messages effect
  useEffect(() => {
    if (!isLoading) return

    const intervalId = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 1800)

    return () => clearInterval(intervalId)
  }, [isLoading])

  const isReadyToRoast =
    currentTurn === 'ready' &&
    !isEditingAfterError &&
    name1.trim().length > 0 &&
    code1.trim().length > 0 &&
    name2.trim().length > 0 &&
    code2.trim().length > 0 &&
    !hasDuplicateNames &&
    !isLoading

  const handleRoast = async (e) => {
    e.preventDefault()
    if (hasDuplicateNames) {
      setError('name1 and name2 must be different.')
      return
    }
    if (!isReadyToRoast) return

    setIsLoading(true)
    setLoadingMsgIndex(0)
    setError(null)

    try {
      const roastResult = await roastCode({
        name1: name1.trim(),
        code1,
        name2: name2.trim(),
        code2,
      })
      setResult(roastResult)
    } catch (err) {
      setError(
        err.message || 'Failed to generate the roast. Please try again.',
      )
      // A 400 means the input must change; other errors can be retried as is.
      if (err.status === 400) setUnlockedPlayers([1, 2])
    } finally {
      setIsLoading(false)
    }
  }

  const getPlayer1Status = () => {
    if (unlockedPlayers.includes(1)) return 'active'
    return currentTurn === 1 ? 'active' : 'locked'
  }

  const getPlayer2Status = () => {
    if (unlockedPlayers.includes(2)) return 'active'
    if (currentTurn === 1) return 'waiting'
    return currentTurn === 2 ? 'active' : 'locked'
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="badge-tag">GIT BLAME ROULETTE</div>
        <h1 className="app-title">Code Roast 🔥</h1>
        <p className="app-slogan">Paste your code. Get destroyed.</p>
      </header>

      <main className="arena-main">
        {result ? (
          <ResultView
            result={result}
            name1={name1.trim()}
            name2={name2.trim()}
            onReset={handleResetMatch}
          />
        ) : (
          <>
            <MatchSettings
              timerDuration={timerDuration}
              onSelectDuration={handleSelectDuration}
              currentTurn={visibleTurn}
              isMatchStarted={isMatchStarted}
              onResetMatch={handleResetMatch}
            />

            {(error || hasDuplicateNames) && (
              <div className="error-banner" role="alert">
                <span className="error-icon" aria-hidden="true">
                  ⚠️
                </span>
                <span className="error-text">
                  {error ||
                    'Developer names must be different (case-insensitive).'}
                </span>
                {error && (
                  <button
                    type="button"
                    className="error-dismiss"
                    onClick={() => setError(null)}
                    aria-label="Dismiss error"
                  >
                    &times;
                  </button>
                )}
              </div>
            )}

            <form className="roast-form" onSubmit={handleRoast}>
              <div className="panels-grid">
                <CodePanel
                  playerNumber={1}
                  status={getPlayer1Status()}
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
                      visibleTurn === 'ready' ? 'vs-badge-ready' : ''
                    }`}
                  >
                    VS
                  </span>
                </div>

                <CodePanel
                  playerNumber={2}
                  status={getPlayer2Status()}
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
                  className={`roast-button ${
                    isReadyToRoast ? 'ready-pulse' : ''
                  } ${isLoading ? 'is-loading' : ''}`}
                  disabled={!isReadyToRoast}
                >
                  {isLoading ? (
                    <span className="loading-content">
                      <span className="spinner" aria-hidden="true" />
                      <span>{LOADING_MESSAGES[loadingMsgIndex]}</span>
                    </span>
                  ) : hasDuplicateNames ? (
                    'Names Must Be Different ⚠️'
                  ) : isReadyToRoast ? (
                    "Roast 'em 🔥"
                  ) : visibleTurn === 1 ? (
                    'Waiting for Dev 1 to Lock In...'
                  ) : (
                    'Waiting for Dev 2 to Lock In...'
                  )}
                </button>
                <p className="security-warning">
                  Don&apos;t paste secrets or API keys.
                </p>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  )
}

export default App
