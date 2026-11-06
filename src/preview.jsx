/* eslint-disable react-refresh/only-export-components -- entry file for the preview page */
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ResultView from './components/ResultView'

const NAME1 = 'Ayse'
const NAME2 = 'Can'

const ROAST1 =
  "Ayse's function a(b) hands eval a loaded gun and calls it a utility. The names a and b are as meaningful as a fortune cookie. Security reviewed this and quietly updated their resume."
const ROAST2 =
  "Can's add function is tidy, but it will happily concatenate strings and call that math. The name add is so generic it could mean anything in this codebase. Clean code, zero ambition."

function Preview() {
  const [round, setRound] = useState(0)
  const loser = round % 2 === 0 ? NAME1 : NAME2

  const result = {
    loser,
    roast1: ROAST1,
    roast2: ROAST2,
    verdict: `${loser} lost because ${loser}'s code is the reason code review exists.`,
  }

  // The key remounts the view so "Roast again" replays the reveal with the other loser.
  return (
    <ResultView
      key={round}
      result={result}
      name1={NAME1}
      name2={NAME2}
      onReset={() => setRound(round + 1)}
    />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
)
