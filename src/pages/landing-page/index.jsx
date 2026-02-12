import { motion, useMotionValue, useSpring } from "framer-motion"
import { ArrowRight, BarChart3, FileText, Users } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const features = [
  {
    icon: BarChart3,
    title: "Real-time Reports",
    desc: "Visualize revenue, invoices, and growth with live analytics and historical insights.",
  },
  {
    icon: FileText,
    title: "Smart Invoicing",
    desc: "Create, manage, export, and track invoices effortlessly — PDF & CSV supported.",
  },
  {
    icon: Users,
    title: "Client Management",
    desc: "Everything about your clients, projects, and billing — organized in one place.",
  },
]

const LandingPage = () => {
  const navigate = useNavigate()

  // Cursor tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const x = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const y = useSpring(mouseY, { stiffness: 80, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, #6366f1, transparent 40%)",
            "radial-gradient(circle at 80% 30%, #22d3ee, transparent 40%)",
            "radial-gradient(circle at 50% 80%, #a855f7, transparent 40%)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* Cursor glow */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
        >
          Run your business <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            smarter, faster, better
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-white/70"
        >
          A modern platform to manage invoices, track revenue, analyze reports,
          and grow your business — all in one beautifully designed dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-center gap-4"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-black font-semibold transition hover:bg-white/90"
          >
            Get Started
            <ArrowRight className="transition group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => navigate("/reports")}
            className="rounded-xl border border-white/20 px-6 py-3 font-medium text-white/80 backdrop-blur hover:bg-white/10"
          >
            View Reports
          </button>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <Icon className="h-8 w-8 text-indigo-400" />
                <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-white/70">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Your App. Built for modern businesses.
      </footer>
    </div>
  )
}

export default LandingPage
