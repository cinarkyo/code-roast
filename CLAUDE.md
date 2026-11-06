# Code Roast

Web app: React + Vite (JavaScript), deployed on Vercel.
Two users paste code snippets, an LLM (Groq) roasts both like a brutal,
funny senior tech lead and picks a LOSER.

## Rules for AI assistants
- NEVER run git commands (no commit, push, branch, merge, checkout).
  Humans do git via GitHub Desktop.
- Everything is in English: UI text, variable names, file names, comments.
- Only edit files related to the current task.
- The API key is GROQ_API_KEY, used ONLY in api/ (server side, process.env).
  Never use a VITE_ prefix, never send the key to the frontend, never log it.
- Run locally with `vercel dev` (not `npm run dev`).
- Keep it simple: no TypeScript, no extra UI libraries unless asked.

## Structure
- api/roast.js → Vercel serverless function, calls Groq
- src/services/roastClient.js → frontend function that calls /api/roast
- src/App.jsx, src/components/, src/*.css → UI

## API contract
POST /api/roast
Request:  { "name1": string, "code1": string, "name2": string, "code2": string }
Response: { "loser": string, "roast1": string, "roast2": string, "verdict": string }
Error:    { "error": string } with status 400 or 500
Limits: each code max 4000 characters, names max 30 characters.