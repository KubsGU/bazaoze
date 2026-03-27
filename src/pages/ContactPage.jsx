import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function ContactPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="contact" className="section-optimize relative z-20 mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="rounded-3xl border border-emerald-300/30 bg-gradient-to-r from-emerald-400/15 to-transparent p-8 md:p-12"
      >
        <p className="text-sm tracking-[0.32em] text-emerald-200">KONTAKT</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          Porozmawiajmy o nowoczesnym systemie dla Twojego domu.
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-300">
          Napisz lub zadzwon - odpowiemy szybko i zaproponujemy najlepsze rozwiazanie.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="mt-8 grid gap-6 md:grid-cols-3"
      >
        <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="h-full transition duration-300 hover:cursor-pointer hover:border-emerald-300/35 hover:bg-white/[0.05]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Phone className="size-5 text-emerald-300" />
                Telefon
              </CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-300">
              <a href="tel:+48500000000" className="cursor-pointer transition hover:text-white">
                +48 500 000 000
              </a>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="h-full transition duration-300 hover:cursor-pointer hover:border-emerald-300/35 hover:bg-white/[0.05]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Mail className="size-5 text-emerald-300" />
                E-mail
              </CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-300">
              <a href="mailto:biuro@bazaoze.com" className="cursor-pointer transition hover:text-white">
                biuro@bazaoze.com
              </a>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="h-full transition duration-300 hover:cursor-pointer hover:border-emerald-300/35 hover:bg-white/[0.05]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MapPin className="size-5 text-emerald-300" />
                Obszar dzialania
              </CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-300">Instalacje dla domow i firm w calej Polsce.</CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="mt-8 flex flex-wrap gap-4"
      >
        <a href="mailto:biuro@bazaoze.com">
          <Button size="lg">Napisz do nas</Button>
        </a>
        <a href="tel:+48500000000">
          <Button size="lg" variant="secondary">
            Zadzwon teraz
          </Button>
        </a>
      </motion.div>
    </section>
  )
}
