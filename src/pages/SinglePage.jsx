import { useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import HomePage from './HomePage'
import PortfolioPage from './PortfolioPage'
import ContactPage from './ContactPage'

const allowedSections = new Set(['home', 'services', 'metrics', 'projects', 'portfolio', 'contact'])
const sectionIds = ['home', 'services', 'metrics', 'projects', 'portfolio', 'contact']

export default function SinglePage() {
  const { section } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isProgrammaticScrollRef = useRef(false)
  const routeChangeSourceRef = useRef(null)

  useEffect(() => {
    if (!section) {
      return
    }

    if (!allowedSections.has(section)) {
      navigate('/home', { replace: true })
      return
    }

    const target = document.getElementById(section)
    if (target) {
      // Skip autoscroll when URL changed from scroll spy.
      if (routeChangeSourceRef.current === 'observer') {
        routeChangeSourceRef.current = null
        return
      }

      const { top } = target.getBoundingClientRect()
      const isAlreadyInView = top >= 0 && top <= 140
      if (!isAlreadyInView) {
        isProgrammaticScrollRef.current = true
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.setTimeout(() => {
          isProgrammaticScrollRef.current = false
        }, 500)
      }
    }
  }, [navigate, section])

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (sections.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return

        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const active = visibleEntries[0]
        if (!active?.target?.id) return

        const nextPath = `/${active.target.id}`
        if (location.pathname !== nextPath) {
          routeChangeSourceRef.current = 'observer'
          navigate(nextPath, { replace: true })
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.15, 0.35, 0.55, 0.75],
      },
    )

    sections.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [location.pathname, navigate])

  return (
    <>
      <HomePage />
      <PortfolioPage />
      <ContactPage />
    </>
  )
}
