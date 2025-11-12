import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function checkIsTablet() {
  const isClient = typeof window !== "undefined"
  const getInitial = () =>
    isClient ? window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT : false

  const [isTablet, setIsTablet] = React.useState<boolean>(getInitial)

  React.useEffect(() => {
    if (!isClient) return

    const mql = window.matchMedia(
      `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`
    )

    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsTablet(typeof (e as any)?.matches === "boolean" ? (e as any).matches : mql.matches)
    }

    // set initial from the media query (covers cases where innerWidth differs)
    setIsTablet(mql.matches)

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange as EventListener)
      return () => mql.removeEventListener("change", onChange as EventListener)
    } else {
      mql.addListener(onChange as (e: MediaQueryListEvent) => void)
      return () => mql.removeListener(onChange as (e: MediaQueryListEvent) => void)
    }
  }, [isClient])

  return isTablet
}
