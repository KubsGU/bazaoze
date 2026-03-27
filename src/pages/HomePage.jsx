import { motion } from 'framer-motion'
import { ArrowUpRight, Wind, SunMedium, Thermometer, Newspaper, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function HomePage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <>
      <section id="home" className="relative z-20 flex min-h-screen items-center overflow-hidden px-6 py-20 md:px-10">
        <div className="absolute inset-0 opacity-55">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_46%),radial-gradient(circle_at_80%_16%,rgba(250,204,21,0.12),transparent_34%),linear-gradient(to_bottom,rgba(24,24,27,.9),rgba(9,9,11,1))]" />
          <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full border border-white/10" />
          <div className="absolute bottom-16 left-16 h-28 w-28 rounded-full border border-emerald-400/40" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={fadeUp}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-10 mx-auto w-full max-w-6xl"
        >
          <p className="mb-6 text-sm tracking-[0.35em] text-emerald-300/90">BAZA OZE</p>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.96] tracking-tight md:text-7xl">
            NOWOCZESNE ROZWIĄZANIA DLA TWOJEGO DOMU ZACZYNAJĄ SIĘ WŁAŚNIE TUTAJ
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-zinc-300 md:text-xl">
            Systemy rekuperacji, klimatyzacji i ogrzewania dostosowane do potrzeb każdego domu.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/contact">
              <Button size="lg">Umow konsultacje</Button>
            </Link>
            <Link to="/portfolio">
              <Button size="lg" variant="secondary">
                Zobacz realizacje <ArrowUpRight className="size-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section id="services" className="section-optimize relative z-20 mx-auto w-full max-w-6xl px-6 py-24 md:px-10">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="text-4xl font-semibold tracking-tight md:text-5xl"
        >
          Uslugi
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="mt-10 grid gap-6 md:grid-cols-3"
        >
          {[
            {
              icon: Wind,
              title: 'Systemy rekuperacji',
              description: 'Nowoczesne rozwiazania dla komfortu i efektywnej wymiany powietrza.',
            },
            {
              icon: SunMedium,
              title: 'Klimatyzacja',
              description: 'Precyzyjna kontrola temperatury dopasowana do potrzeb domu.',
            },
            {
              icon: Thermometer,
              title: 'Ogrzewanie',
              description: 'Sprawne systemy grzewcze zaprojektowane pod codzienne uzytkowanie.',
            },
          ].map((service) => (
            <motion.div key={service.title} variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="h-full transition duration-300 hover:cursor-pointer hover:border-emerald-300/35 hover:bg-white/[0.05]">
                <CardHeader>
                  <service.icon className="size-8 text-emerald-300" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-zinc-300">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="metrics" className="section-optimize relative z-20 border-y border-white/10 bg-white/[0.02] py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:grid-cols-3 md:px-10">
          {[
            { value: '3', label: 'obszary oferty dla domu' },
            { value: '1', label: 'spojny partner techniczny' },
            { value: '360°', label: 'podejscie do komfortu' },
          ].map((metric) => (
            <motion.div
              key={metric.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              className="text-center md:text-left"
            >
              <p className="text-6xl font-semibold tracking-tight md:text-7xl">{metric.value}</p>
              <p className="mt-3 text-zinc-300">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="projects" className="section-optimize relative z-20 mx-auto w-full max-w-6xl px-6 py-24 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-6 md:grid-cols-2"
        >
          <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="h-full transition duration-300 hover:cursor-pointer hover:border-emerald-300/35 hover:bg-white/[0.05]">
              <CardHeader>
                <Briefcase className="size-7 text-emerald-300" />
                <CardTitle>Projekty / Case studies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-zinc-300">
                <p>BAZA OZE - nowoczesne rozwiazania dla Twojego domu.</p>
                <p>Rekuperacja, klimatyzacja i ogrzewanie w jednym, przemyslanym ekosystemie.</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="h-full transition duration-300 hover:cursor-pointer hover:border-emerald-300/35 hover:bg-white/[0.05]">
              <CardHeader>
                <Newspaper className="size-7 text-emerald-300" />
                <CardTitle>Blog</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-zinc-300">
                <p>Przeglad praktycznych informacji o systemach domowych i efektywnosci energii.</p>
                <p>Najnowsze wpisy i aktualnosci beda publikowane tutaj.</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      <section id="contact-cta" className="section-optimize relative z-20 px-6 pb-24 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={fadeUp}
          className="mx-auto w-full max-w-6xl rounded-3xl border border-emerald-300/30 bg-gradient-to-r from-emerald-400/15 to-transparent p-10 md:p-14"
        >
          <p className="text-sm tracking-[0.32em] text-emerald-200">KONTAKT</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            BAZA OZE - porozmawiajmy o nowoczesnym systemie dla Twojego domu.
          </h2>
          <div className="mt-8">
            <Link to="/contact">
              <Button size="lg">Skontaktuj sie z nami</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  )
}
