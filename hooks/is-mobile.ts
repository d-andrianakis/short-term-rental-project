import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function checkIsMobile() {
  const isClient = typeof window !== "undefined"
  const getInitial = () => (isClient ? window.innerWidth < MOBILE_BREAKPOINT : false)

  const [isMobile, setIsMobile] = React.useState<boolean>(getInitial)

  React.useEffect(() => {
    if (!isClient) return

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // MediaQueryListEvent has .matches, older MediaQueryList calls the same on some browsers
      // fallback to mql.matches if event is not provided
      setIsMobile(typeof (e as data)?.matches === "boolean" ? (e as data).matches : mql.matches)
    }

    // set initial from the media query (covers cases where innerWidth differs)
    setIsMobile(mql.matches)

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange as EventListener)
      return () => mql.removeEventListener("change", onChange as EventListener)
    } else {
      // fallback for older browsers
      mql.addListener(onChange as (e: MediaQueryListEvent) => void)
      return () => mql.removeListener(onChange as (e: MediaQueryListEvent) => void)
    }
  }, [isClient])

  return isMobile
}
