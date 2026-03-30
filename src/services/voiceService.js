import API from './api'

/**
 * Send a transcribed question and receive a text + audio response.
 * @param {string} question
 * @returns {Promise<{ audioBase64: string, text: string, timestamp: string }>}
 */
export async function askVoiceQuestion(question) {
  const response = await API.post('/api/voice', { question })
  return response.data
}
