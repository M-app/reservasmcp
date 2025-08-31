// WARNING: Para producción NO hardcodees claves.
// Fallback: reemplaza '<PASTE_OPENAI_KEY_HERE>' por tu clave si no quieres usar variables de entorno.
export const OPENAI_API_KEY = (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()) || 'REDACTED';
