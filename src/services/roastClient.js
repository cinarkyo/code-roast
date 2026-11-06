export async function roastCode({ name1, code1, name2, code2 }) {
  let response
  try {
    response = await fetch('/api/roast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name1: name1.trim(),
        code1,
        name2: name2.trim(),
        code2,
      }),
    })
  } catch {
    throw new Error('Network error. Could not reach the roast server.')
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Server returned an invalid response.')
  }

  if (!response.ok) {
    throw new Error(
      data?.error || `Request failed with status ${response.status}.`,
    )
  }

  return data
}
