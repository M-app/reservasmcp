import express from 'express'

const router = express.Router()

router.post('/token', async (req, res, next) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    const { model = 'gpt-realtime' } = req.body || {}
    if (!apiKey) {
      const err = new Error('OPENAI_API_KEY is not configured')
      err.status = 500
      throw err
    }

    const resp = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'realtime=v1',
      },
      body: JSON.stringify({ session: { type: 'realtime', model } }),
    })

    const data = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      const err = new Error(`OpenAI token error: ${resp.status} ${data?.error?.message || ''}`)
      err.status = 502
      throw err
    }

    const value = data?.client_secret?.value || data?.client_secret || data?.value
    const expires_at = data?.client_secret?.expires_at || data?.expires_at

    if (!value) {
      return res.status(502).json({ error: 'No client_secret in OpenAI response', raw: data })
    }

    return res.json({ client_secret: value, expires_at })
  } catch (e) {
    next(e)
  }
})

export default router
