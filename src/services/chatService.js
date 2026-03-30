import API from './api'

/**
 * Send a text question and receive a text answer.
 * @param {string} question
 * @returns {Promise<{ answer: string, timestamp: string }>}
 */
export async function askQuestion(question) {
  const response = await API.post('/api/chat', { question })
  return response.data
}
