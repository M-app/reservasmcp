import express from 'express'
import { env } from '../config/env.js'

const router = express.Router()

// Proxy para crear cita en Belliata
router.post('/appointments', async (req, res, next) => {
  try {
    const {
      date_time,
      date,
      time,
      note = '',
      duration = 45,
      customer_id = 1,
      pricing_id = 278473,
      variant_id = 293049,
      employee_id = 98592,
    } = req.body || {}

    const dt = date_time || (date && time ? `${date} ${time}` : null)
    if (!dt) {
      const err = new Error('date_time ("YYYY-MM-DD HH:mm") requerido')
      err.status = 400
      throw err
    }

    const payload = {
      customer_id,
      note,
      recurring: null,
      appointments: [
        {
          is_deleted: 0,
          is_requested: 0,
          pricing_id,
          variant_id,
          employee_id,
          date_time: dt,
          status: 'new',
          resource_id: 0,
          duration,
          duration_detail: {
            initial: duration,
            gap: 0,
            finish: 0,
          },
        },
      ],
    }

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    // Permitir bearer desde el frontend (opcional). Si es un token sin prefijo, se antepone "Bearer ".
    const incomingAuth = req.headers['authorization'] || req.headers['x-belliata-token']
    if (incomingAuth && typeof incomingAuth === 'string') {
      headers['Authorization'] = incomingAuth.toLowerCase().startsWith('bearer ') ? incomingAuth : `Bearer ${incomingAuth}`
    }
    if (!headers['Authorization'] && env.belliataAuthScheme === 'bearer' && env.belliataApiKey) {
      headers['Authorization'] = `Bearer ${env.belliataApiKey}`
    } else if (!headers['Authorization'] && env.belliataAuthScheme === 'x-api-key' && env.belliataApiKey) {
      headers['X-Api-Key'] = env.belliataApiKey
    } else if (!headers['Authorization'] && env.belliataAuthScheme === 'basic' && env.belliataBasicUser && env.belliataBasicPass) {
      const basic = Buffer.from(`${env.belliataBasicUser}:${env.belliataBasicPass}`).toString('base64')
      headers['Authorization'] = `Basic ${basic}`
    }

    async function postAppointment(hdrs) {
      const r = await fetch(env.belliataApiUrl, { method: 'POST', headers: hdrs, body: JSON.stringify(payload) })
      const j = await r.json().catch(() => ({}))
      return { ok: r.ok, status: r.status, data: j }
    }

    // Si no hay token preconfigurado y hay credenciales, intenta login previo
    let result
    let preparedHeaders = { ...headers }
    const hasPreAuth = Boolean(preparedHeaders.Authorization || preparedHeaders['X-Api-Key'])
    if (!hasPreAuth && env.belliataLoginEmail && env.belliataLoginPassword) {
      try {
        const loginResp = await fetch(env.belliataLoginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: env.belliataLoginEmail, password: env.belliataLoginPassword }),
        })
        const loginJson = await loginResp.json().catch(() => ({}))
        const token = loginJson?.token
        if (loginResp.ok && token) {
          preparedHeaders['Authorization'] = `Bearer ${token}`
        }
      } catch {
        // silent
      }
    }

    // Primer intento
    result = await postAppointment(preparedHeaders)
    // Si 401 intentar login silencioso y reintentar
    if (!result.ok && result.status === 401 && env.belliataLoginEmail && env.belliataLoginPassword) {
      try {
        const loginResp = await fetch(env.belliataLoginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: env.belliataLoginEmail, password: env.belliataLoginPassword }),
        })
        const loginJson = await loginResp.json().catch(() => ({}))
        const token = loginJson?.token
        if (loginResp.ok && token) {
          const newHeaders = { ...headers }
          newHeaders['Authorization'] = `Bearer ${token}`
          result = await postAppointment(newHeaders)
        }
      } catch {
        // ignore silent fallback
      }
    }

    if (!result.ok) {
      const err = new Error(`Belliata error: ${result.status}`)
      err.status = result.status
      err.details = result.data
      throw err
    }

    res.json(result.data)
  } catch (e) {
    next(e)
  }
})

export default router


