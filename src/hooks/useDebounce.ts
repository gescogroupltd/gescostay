import { useState, useEffect } from 'react'

/**
 * useDebounce — retarde la mise à jour d'une valeur.
 * Évite les requêtes excessives lors de la saisie dans les filtres.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
