import { useState } from 'react'
import api from '../services/api'

export function useSubmitEnquiry() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const submit = async (data) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await api.post('/api/enquiries', data)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Failed to send enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setSuccess(false)
    setError(null)
  }

  return { submit, loading, error, success, reset }
}
