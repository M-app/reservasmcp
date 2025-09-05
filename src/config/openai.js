// WARNING: Para producción NO hardcodees claves.
// Usa únicamente variables de entorno: OPENAI_API_KEY
export const OPENAI_API_KEY = (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()) || ''
