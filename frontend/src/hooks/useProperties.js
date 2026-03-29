import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export function useProperties(filters = {}, page = 1) {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Stable key for filter dependency
  const filterKey = JSON.stringify({ ...filters, page })

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { ...filters, page }
      // Strip empty values
      Object.keys(params).forEach((k) => {
        if (params[k] === '' || params[k] == null) delete params[k]
      })
      const res = await api.get('/api/properties', { params })
      setData(res.data.data ?? [])
      setTotal(res.data.total ?? 0)
      setTotalPages(res.data.totalPages ?? 1)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Failed to load properties.')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return { data, total, totalPages, loading, error, refetch: fetchProperties }
}

export function useProperty(id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    api
      .get(`/api/properties/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error ?? 'Property not found.'))
      .finally(() => setLoading(false))
  }, [id])

  return { data, loading, error }
}

export function useFeaturedProperties() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/api/properties/featured')
      .then((res) => setData(res.data.data ?? res.data ?? []))
      .catch((err) => setError(err.response?.data?.error ?? 'Failed to load featured properties.'))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
