import { useEffect, useRef } from 'react'

export const useDebounce = (callback: (...args: Array<any>) => void, wait: number) => {
  // track args & timeout handle between calls
  const argsRef = useRef<Array<any>>(undefined)
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const clearTimer = () => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
  }

  // make sure our timeout gets cleared if
  // our consuming component gets unmounted
  useEffect(() => {
    return () => clearTimer()
  }, [])

  const debouncedCallback = (...args: Array<any>) => {
    // capture latest args
    argsRef.current = args

    // clear debounce timer
    clearTimer()

    // start waiting again
    timeout.current = setTimeout(() => {
      if (argsRef.current) {
        callback(...argsRef.current)
      }
    }, wait)
  }

  return debouncedCallback
}
