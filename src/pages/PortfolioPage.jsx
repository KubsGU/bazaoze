import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

function optimizeImageUrl(src, width = 1200, quality = 72) {
  try {
    const parsed = new URL(src)
    if (!parsed.hostname.includes('bazaoze.com')) return src
    const normalizedPath = `${parsed.hostname}${parsed.pathname}`.replace(/^www\./, '')
    return `https://images.weserv.nl/?url=${encodeURIComponent(normalizedPath)}&w=${width}&q=${quality}&output=webp&we`
  } catch {
    return src
  }
}

function ProgressiveImage({
  src,
  alt,
  wrapperClassName,
  imgClassName,
  eager = false,
  width = 1200,
  quality = 72,
  fetchPriority = 'low',
}) {
  const rootRef = useRef(null)
  const [inView, setInView] = useState(eager)
  const [loaded, setLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const optimizedSrc = hasError ? src : optimizeImageUrl(src, width, quality)
  const placeholderSrc = hasError ? src : optimizeImageUrl(src, 64, 32)

  useEffect(() => {
    if (eager) return undefined
    const node = rootRef.current
    if (!node) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '120px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [eager])

  return (
    <div ref={rootRef} className={`relative overflow-hidden ${wrapperClassName ?? ''}`}>
      <img
        src={placeholderSrc}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover blur-xl scale-110 transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div
        className={`absolute inset-0 animate-pulse bg-white/10 transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {inView ? (
        <img
          src={optimizedSrc}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
          className={`${imgClassName ?? ''} transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}
    </div>
  )
}

function CaseStudyCard({ group }) {
  const [expanded, setExpanded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const visibleItems = expanded ? group.items : group.items.slice(0, 3)
  const hasActiveImage = activeIndex !== null

  useEffect(() => {
    if (!hasActiveImage) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
        return
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((idx) => (idx === null ? 0 : (idx + 1) % group.items.length))
        return
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((idx) => (idx === null ? 0 : (idx - 1 + group.items.length) % group.items.length))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [group.items.length, hasActiveImage])

  useEffect(() => {
    if (!hasActiveImage) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [hasActiveImage])

  const handleCardMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const relativeX = (event.clientX - bounds.left) / bounds.width
    const relativeY = (event.clientY - bounds.top) / bounds.height
    const rotateY = (relativeX - 0.5) * 9
    const rotateX = (0.5 - relativeY) * 7
    setTilt({ rotateX, rotateY })
  }

  const handleCardMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="h-full hover:cursor-pointer"
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: 'preserve-3d',
          transformPerspective: 1200,
        }}
      >
        <Card className="group h-full overflow-hidden border-white/15 bg-white/[0.04] p-0 transition duration-300 hover:border-emerald-300/40 hover:bg-white/[0.06]">
          <div className="relative overflow-hidden">
            <ProgressiveImage
              src={group.cover}
              alt={group.title}
              wrapperClassName="h-56 w-full"
              imgClassName="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              width={1280}
              quality={72}
              fetchPriority="high"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-900/25 to-transparent" />
            <div className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-zinc-950/65 px-3 py-1 text-xs text-zinc-200 backdrop-blur">
              {group.items.length} realizacji
            </div>
          </div>

          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">{group.title}</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/90">{group.description}</p>
              <p className="text-sm leading-relaxed text-zinc-300">{group.baseDescription}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => (
                <span
                  key={`${group.title}-${tag}`}
                  className="rounded-full border border-white/15 bg-zinc-900/70 px-3 py-1 text-xs text-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {visibleItems.map((item, visibleIndex) => {
                const sourceIndex = expanded ? visibleIndex : visibleIndex
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveIndex(sourceIndex)}
                    className="group/thumb relative h-20 w-full overflow-hidden rounded-xl border border-white/10 text-left"
                    aria-label={`Otworz podglad realizacji ${visibleIndex + 1} dla ${group.title}`}
                  >
                    <ProgressiveImage
                      src={item}
                      alt={`${group.title} - miniatura ${visibleIndex + 1}`}
                      wrapperClassName="h-full w-full"
                      imgClassName="h-full w-full rounded-xl object-cover transition duration-500 group-hover/thumb:scale-110"
                      width={360}
                      quality={60}
                      fetchPriority="low"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-zinc-950/0 transition group-hover/thumb:bg-zinc-950/20" />
                  </button>
                )
              })}
            </div>

            {group.items.length > 3 ? (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
              className="cursor-pointer text-sm text-emerald-300 transition hover:text-emerald-200"
              >
                {expanded ? 'Pokaz mniej' : `Pokaz wszystkie (${group.items.length})`}
              </button>
            ) : null}
          </div>
        </Card>
      </motion.div>

      <AnimatePresence>
        {hasActiveImage ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`Podglad galerii ${group.title}`}
            onClick={() => setActiveIndex(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <motion.div
              className="relative w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-3 top-3 z-10 cursor-pointer rounded-full border border-white/25 bg-zinc-950/70 p-2 text-zinc-100 transition hover:bg-zinc-800"
              aria-label="Zamknij podglad"
            >
              <X className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveIndex((idx) => (idx === null ? 0 : (idx - 1 + group.items.length) % group.items.length))}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full border border-white/25 bg-zinc-950/70 p-2 text-zinc-100 transition hover:bg-zinc-800"
              aria-label="Poprzednie zdjecie"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveIndex((idx) => (idx === null ? 0 : (idx + 1) % group.items.length))}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full border border-white/25 bg-zinc-950/70 p-2 text-zinc-100 transition hover:bg-zinc-800"
              aria-label="Nastepne zdjecie"
            >
              <ChevronRight className="size-5" />
            </button>

              <motion.img
                key={group.items[activeIndex]}
                src={optimizeImageUrl(group.items[activeIndex], 1680, 76)}
                alt={`${group.title} - zdjecie ${activeIndex + 1}`}
                className="max-h-[80vh] w-full rounded-2xl border border-white/15 object-contain"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />

              <p className="mt-3 text-center text-sm text-zinc-300">
                {activeIndex + 1} / {group.items.length}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default function PortfolioPage() {
  const sectionRef = useRef(null)
  const [cursorActive, setCursorActive] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  }

  const legacyContent = [
    {
      brand: 'BAZA OZE',
      headline: 'NOWOCZESNE ROZWIĄZANIA DLA TWOJEGO DOMU ZACZYNAJĄ SIĘ WŁAŚNIE TUTAJ',
      description:
        'Systemy rekuperacji, klimatyzacji i ogrzewania dostosowane do potrzeb każdego domu.',
    },
    {
      brand: 'BAZA OZE',
      headline: 'NOWOCZESNE ROZWIĄZANIA DLA TWOJEGO DOMU ZACZYNAJĄ SIĘ WŁAŚNIE TUTAJ',
      description:
        'Systemy rekuperacji, klimatyzacji i ogrzewania dostosowane do potrzeb każdego domu.',
    },
  ]

  const legacyRoutes = [
    { label: 'Subpage: /offer', href: 'https://www.bazaoze.com/offer' },
    { label: 'Subpage: /offerInside', href: 'https://www.bazaoze.com/offerInside' },
    { label: 'Subpage: /portfolio', href: 'https://www.bazaoze.com/portfolio' },
    { label: 'Subpage: /contact', href: 'https://www.bazaoze.com/contact' },
    { label: 'Subpage: /blog', href: 'https://www.bazaoze.com/blog' },
  ]

  const legacyImageGroups = [
    {
      title: 'Fotowoltaika (PV)',
      description: 'FOTOWOLTAIKA I MAGAZYNY ENERGII',
      baseDescription:
        'Nowoczesne rozwiazania dla komfortu i efektywnego wykorzystania energii w domu i firmie.',
      tags: ['PV', 'Magazyny energii', 'Efektywnosc'],
      cover: 'https://www.bazaoze.com/assets/images/PV.jpeg',
      items: [
        'https://www.bazaoze.com/assets/images/PV/1.jpeg',
        'https://www.bazaoze.com/assets/images/PV/2.jpeg',
        'https://www.bazaoze.com/assets/images/PV/3.jpg',
        'https://www.bazaoze.com/assets/images/PV/4.jpg',
        'https://www.bazaoze.com/assets/images/PV/5.jpg',
        'https://www.bazaoze.com/assets/images/PV/6.jpg',
      ],
    },
    {
      title: 'Klimatyzacja',
      description: 'KLIMATYZACJA',
      baseDescription: 'Precyzyjna kontrola temperatury dopasowana do potrzeb domu.',
      tags: ['Komfort', 'Sterowanie', 'Oszczednosc'],
      cover: 'https://www.bazaoze.com/assets/images/klimatyzacja/1.JPG',
      items: [
        'https://www.bazaoze.com/assets/images/klimatyzacja/2.JPG',
        'https://www.bazaoze.com/assets/images/klimatyzacja/3.JPG',
        'https://www.bazaoze.com/assets/images/klimatyzacja/4.JPG',
        'https://www.bazaoze.com/assets/images/klimatyzacja/5.JPG',
        'https://www.bazaoze.com/assets/images/klimatyzacja/6.JPG',
      ],
    },
    {
      title: 'Rekuperacja',
      description: 'Ile kosztuje rekuperacja na 100 m2? / Czy przy rekuperacji potrzebny jest komin',
      baseDescription: 'Nowoczesne rozwiazania dla komfortu i efektywnej wymiany powietrza.',
      tags: ['Wentylacja', 'Jakosc powietrza', 'Energooszczednosc'],
      cover: 'https://www.bazaoze.com/assets/images/rekuperacja/1.JPG',
      items: [
        'https://www.bazaoze.com/assets/images/rekuperacja/2.JPG',
        'https://www.bazaoze.com/assets/images/rekuperacja/3.JPG',
        'https://www.bazaoze.com/assets/images/rekuperacja/4.JPG',
        'https://www.bazaoze.com/assets/images/rekuperacja/5.JPG',
        'https://www.bazaoze.com/assets/images/rekuperacja/6.JPG',
      ],
    },
    {
      title: 'Pompy Ciepla',
      description: 'POMPY CIEPLA',
      baseDescription: 'Sprawne systemy grzewcze zaprojektowane pod codzienne uzytkowanie.',
      tags: ['Ogrzewanie', 'Niskie koszty', 'Nowoczesne systemy'],
      cover: 'https://www.bazaoze.com/assets/images/pompyCiepla/1.JPG',
      items: [
        'https://www.bazaoze.com/assets/images/pompyCiepla/2.JPG',
        'https://www.bazaoze.com/assets/images/pompyCiepla/3.JPG',
        'https://www.bazaoze.com/assets/images/pompyCiepla/4.JPG',
        'https://www.bazaoze.com/assets/images/pompyCiepla/5.JPG',
        'https://www.bazaoze.com/assets/images/pompyCiepla/6.JPG',
        'https://www.bazaoze.com/assets/images/pompyCiepla/7.JPG',
        'https://www.bazaoze.com/assets/images/pompyCiepla/8.JPG',
      ],
    },
  ]

  const handleSectionMouseMove = (event) => {
    const sectionNode = sectionRef.current
    if (!sectionNode) return
    const bounds = sectionNode.getBoundingClientRect()
    setCursorPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    })
  }

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="section-optimize relative mx-auto w-full max-w-6xl overflow-hidden px-6 py-24 md:px-10"
      onMouseEnter={() => setCursorActive(true)}
      onMouseLeave={() => setCursorActive(false)}
      onMouseMove={handleSectionMouseMove}
    >
      <AnimatePresence>
        {cursorActive ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute hidden h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/12 blur-3xl md:block"
            style={{ left: cursorPosition.x, top: cursorPosition.y }}
          />
        ) : null}
      </AnimatePresence>

      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={fadeUp}
        className="mb-10 text-4xl font-semibold tracking-tight md:text-5xl"
      >
        Case studies i galerie
      </motion.h2>
      <p className="mb-10 max-w-3xl text-zinc-300">
        Systemy rekuperacji, klimatyzacji i ogrzewania dostosowane do potrzeb kazdego domu.
      </p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="mb-10 grid gap-6 md:grid-cols-2"
      >
        {legacyImageGroups.map((group) => (
          <motion.div key={group.title} variants={fadeUp}>
            <CaseStudyCard group={group} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="mb-16 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
      >
        <h3 className="mb-4 text-xl font-semibold">Odzyskane subpages i kontakt</h3>
        <div className="mb-4 flex flex-wrap gap-3">
          {legacyRoutes.map((route) => (
            <a
              key={route.href}
              href={route.href}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
            >
              {route.label}
            </a>
          ))}
        </div>
        <p className="text-sm text-zinc-300">
          E-mail odzyskany z poprzedniego builda:{' '}
          <a className="underline" href="mailto:biuro@bazaoze.com">
            biuro@bazaoze.com
          </a>
        </p>
      </motion.div>

      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={fadeUp}
        className="mb-10 text-4xl font-semibold tracking-tight md:text-5xl"
      >
        Zarchiwizowana tresc z poprzedniej strony
      </motion.h2>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid gap-6"
      >
        {legacyContent.map((item, index) => (
          <motion.div key={`${item.brand}-${index}`} variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle>{item.brand}</CardTitle>
                <CardDescription className="text-zinc-300">{item.headline}</CardDescription>
              </CardHeader>
              <CardContent className="text-zinc-300">{item.description}</CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
