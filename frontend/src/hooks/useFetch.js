import { useState, useEffect, useCallback } from 'react'

export const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result.data)
    } catch (err) {
      setError(err.response?.data || { detail: 'Failed to fetch' })
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { execute() }, [execute])

  return { data, loading, error, refetch: execute }
}
