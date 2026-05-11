import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState(() => localStorage.getItem('salarytrack_dark') === '1')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('salarytrack_dark', dark ? '1' : '0')
  }, [dark])

  const toggle = () => setDark((d) => !d)

  return { dark, toggle }
}
