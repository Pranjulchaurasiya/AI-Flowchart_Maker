import axios from 'axios'

const API_URL = 'http://localhost:8000'

export const generateFromText = async (text) => {
  const response = await axios.post(`${API_URL}/generate/text`, { text })
  return response.data
}

export const generateFromPrompt = async (prompt) => {
  const response = await axios.post(`${API_URL}/generate/prompt`, { prompt })
  return response.data
}

export const generateFromImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await axios.post(`${API_URL}/generate/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}
