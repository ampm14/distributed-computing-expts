// API Configuration for cross-machine deployment
const getApiBaseUrl = () => {
  // Development: Use localhost
  if (import.meta.env.DEV) {
    return "http://localhost:5000/api"
  }

  // Production: Use environment variable or default
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
}

export const API_BASE_URL = getApiBaseUrl()

// Network diagnostics helper
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace("/api", "")}/api/health`)
    return response.ok
  } catch (error) {
    console.error("Connection test failed:", error)
    return false
  }
}
