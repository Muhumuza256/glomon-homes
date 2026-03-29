import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const CurrencyContext = createContext({ usdRate: null })

export function CurrencyProvider({ children }) {
  const [usdRate, setUsdRate] = useState(null)

  useEffect(() => {
    api.get('/api/currency/rate')
      .then((res) => setUsdRate(res.data.rate))
      .catch(() => {
        // Silently fall back — USD display will be hidden when rate is null
      })
  }, [])

  return (
    <CurrencyContext.Provider value={{ usdRate }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
