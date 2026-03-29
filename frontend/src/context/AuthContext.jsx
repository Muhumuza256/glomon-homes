import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
  const [localAuth, setLocalAuth] = useState(
    () => localStorage.getItem('admin_local') === 'true'
  )

  // Called when backend returns a real JWT
  const login = (jwt) => {
    localStorage.setItem('admin_token', jwt)
    setToken(jwt)
  }

  // Called when backend is unavailable — hardcoded credential fallback
  const loginLocal = () => {
    localStorage.setItem('admin_local', 'true')
    setLocalAuth(true)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_local')
    setToken(null)
    setLocalAuth(false)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        loginLocal,
        logout,
        isAuthenticated: !!token || localAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
