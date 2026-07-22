import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport it gets the `animate-in` class
 * (visible). The initial state class `animate-out` should be set
 * in the component via the `revealClass` helper.
 *
 * @param {object} options
 * @param {number} options.threshold  - 0–1, default 0.15
 * @param {string} options.delay      - Tailwind delay class, e.g. 'delay-100'
 */
export function useScrollReveal({ threshold = 0.15 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-visible')
          observer.unobserve(el) // fire only once
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
