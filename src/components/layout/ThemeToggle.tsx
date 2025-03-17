import * as React from 'react'
import { SunIcon, MoonIcon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import { useEffect } from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { setTheme } from '../../store/themeSlice'

export function ThemeToggle() {
  // Check system preference, fallback to dark
  const { theme } = useAppSelector(state => state.theme)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Check if user has theme preference in localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      dispatch(setTheme(savedTheme as 'light' | 'dark'))
      return
    }

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      dispatch(setTheme('dark'))
    } else {
      dispatch(setTheme('light'))
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    dispatch(setTheme(newTheme))
  }

  return (
    <Button
      style={{ cursor: 'pointer' }}
      variant="ghost" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}