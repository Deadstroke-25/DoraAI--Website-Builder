import {
  ArrowRight,
  Sparkles,
  Pencil,
  Smartphone,
  Shield,
  Code,
  Rocket,
  Zap,
  Brain,
  Globe,
  Eye,
  FileCode,
  Upload,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import React, { useState, useMemo, useCallback } from "react"
import Navbar from "../components/Navbar"
import LoginModal from "../components/LoginModal"

/* ─── Static Data (hoisted outside component) ─── */

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Website Generation",
    description: "Generate complete website layouts from a single natural language prompt using advanced AI.",
    color: "indigo",
  },
  {
    icon: Pencil,
    title: "Live Visual Editing",
    description: "Modify generated pages instantly with an intuitive real-time editing experience.",
    color: "purple",
  },
  {
    icon: Smartphone,
    title: "Responsive by Default",
    description: "Every generated website automatically adapts to desktop, tablet, and mobile devices.",
    color: "cyan",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "Google Authentication powered by Firebase for secure user access.",
    color: "emerald",
  },
  {
    icon: Code,
    title: "Production Code Export",
    description: "Export production-ready code or deploy your website directly with a single click.",
    color: "amber",
  },
  {
    icon: Rocket,
    title: "One-Click Deployment",
    description: "Deploy generated websites to modern hosting platforms with minimal configuration.",
    color: "pink",
  },
]

const ICON_STYLES = {
  indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  pink: { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400" },
}

const TIMELINE_STEPS = [
  { icon: Pencil, label: "Prompt" },
  { icon: Brain, label: "AI Processing" },
  { icon: Globe, label: "Website Generation" },
  { icon: Eye, label: "Live Preview" },
  { icon: FileCode, label: "Edit" },
  { icon: Upload, label: "Export or Deploy" },
]

const TECH_STACK = [
  "React", "Tailwind CSS", "Redux Toolkit", "Node.js",
  "Express.js", "MongoDB", "Firebase Auth", "LLM Integration", "Vercel", "GitHub",
]

const WHY_CARDS = [
  { emoji: "⚡", title: "AI-Powered Generation", desc: "Transform natural language descriptions into fully functional websites in seconds." },
  { emoji: "📱", title: "Fully Responsive", desc: "Every generated website looks perfect on desktop, tablet, and mobile devices." },
  { emoji: "🔒", title: "Secure Authentication", desc: "Enterprise-grade Google authentication keeps your projects safe and private." },
  { emoji: "🚀", title: "Production-Ready Code", desc: "Export clean, deployable code that follows modern web development best practices." },
]

const METRICS = [
  { value: "<15min", label: "Generation Time" },
  { value: "Cross-Platform", label: "Desktop \u2022 Tablet \u2022 Mobile" },
  { value: "Secure", label: "Authentication" },
  { value: "Clean", label: "Production Code" },
  { value: "Responsive", label: "UI" },
]

const FOOTER_LINKS = [
  { label: "Home", path: "/" },
  { label: "Pricing", path: "/pricing" },
  { label: "Dashboard", path: "/dashboard" },
]

const FOOTER_TECH = ["React", "Node.js", "MongoDB", "Firebase", "LLM Integration", "Vercel", "GitHub"]

/* ─── Reusable Sub-Components ─── */

const SectionHeading = React.memo(({ eyebrow, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16"
  >
    {eyebrow && (
      <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3 block">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
      {title}
    </h2>
    {description && (
      <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    )}
  </motion.div>
))
SectionHeading.displayName = "SectionHeading"

const GlassCard = React.memo(({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -6, borderColor: "rgba(99, 102, 241, 0.3)" }}
    className={`p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md hover:bg-white/[0.04] transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] ${className}`}
  >
    {children}
  </motion.div>
))
GlassCard.displayName = "GlassCard"

/* ─── Main Component ─── */

const Home = () => {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)
  const [openLogin, setOpenLogin] = useState(false)

  const handleStartBuilding = useCallback(() => {
    if (userData) {
      navigate('/generate')
    } else {
      setOpenLogin(true)
    }
  }, [userData, navigate])

  const scrollToSection = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const featureCards = useMemo(() => FEATURES.map((f, i) => {
    const Icon = f.icon
    const style = ICON_STYLES[f.color]
    return (
      <GlassCard key={f.title} delay={i * 0.08} className="text-left group">
        <div className={`w-12 h-12 rounded-xl ${style.bg} border ${style.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${style.text}`} />
        </div>
        <h3 className="font-bold text-base mb-2 text-white">{f.title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
      </GlassCard>
    )
  }), [])

  return (
    <>
      <Navbar />

      <main className="bg-[#030303] text-white overflow-hidden">

        {/* ─── Ambient Background ─── */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-indigo-600/8 rounded-full blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[140px]"
          />
        </div>

        {/* Grid overlay */}
        <div
          className="fixed inset-0 opacity-[0.03] z-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ━━━ SECTION 1: HERO ━━━ */}
        <section
          id="hero"
          aria-label="Hero section"
          className="relative z-10 min-h-screen flex flex-col justify-center"
        >
          <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-white/[0.08] rounded-full bg-white/[0.03] backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                AI-Powered Full-Stack Website Builder
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight max-w-4xl mx-auto"
            >
              Generate Production-Ready
              <span className="block mt-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Websites with AI
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-2xl mx-auto mt-6 text-sm md:text-base text-zinc-400 leading-relaxed"
            >
              Describe your idea in natural language.
              <br className="hidden sm:block" />{" "}
              DoraAI transforms your prompt into responsive websites,
              <br className="hidden sm:block" />{" "}
              modern user interfaces, and production-ready code using advanced AI.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10"
            >
              <motion.button
                onClick={handleStartBuilding}
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(99, 102, 241, 0.3)" }}
                whileTap={{ scale: 0.97 }}
                aria-label="Generate a website"
                className="group flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl font-bold text-sm uppercase tracking-wider text-white transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-500/20"
              >
                <span>Generate Website</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.button
                onClick={() => scrollToSection("how-it-works")}
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.97 }}
                aria-label="View demo"
                className="px-8 py-4 border border-white/10 rounded-xl font-semibold text-sm uppercase tracking-wider text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer"
              >
                View Demo
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* ━━━ SECTION 2: FEATURES ━━━ */}
        <section id="features" aria-label="Features" className="relative z-10 py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <SectionHeading
              eyebrow="Features"
              title="Everything You Need to Build"
              description="From AI generation to one-click deployment — DoraAI handles the entire website creation pipeline."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards}
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 3: HOW IT WORKS ━━━ */}
        <section id="how-it-works" aria-label="How DoraAI works" className="relative z-10 py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <SectionHeading
              eyebrow="Workflow"
              title="How DoraAI Works"
              description="From prompt to production in six simple steps."
            />

            {/* Desktop Timeline */}
            <div className="hidden md:flex items-center justify-between relative">
              {/* Connecting line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute top-8 left-[8%] right-[8%] h-px bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40 origin-left"
              />

              {TIMELINE_STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    className="relative flex flex-col items-center z-10"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, borderColor: "rgba(99, 102, 241, 0.5)" }}
                      className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-3 transition-all duration-300"
                    >
                      <Icon className="w-6 h-6 text-indigo-400" />
                    </motion.div>
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      {step.label}
                    </span>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <ChevronRight className="absolute -right-6 top-5 w-4 h-4 text-zinc-600 hidden lg:block" />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Mobile Timeline (vertical) */}
            <div className="md:hidden space-y-6">
              {TIMELINE_STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-zinc-500 w-5">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm font-semibold text-zinc-200">{step.label}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 4: TECH STACK ━━━ */}
        <section id="tech-stack" aria-label="Technology stack" className="relative z-10 py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeading
              eyebrow="Stack"
              title="Technology Stack"
              description="Modern technologies powering DoraAI."
            />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {TECH_STACK.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.08, borderColor: "rgba(99, 102, 241, 0.4)" }}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-zinc-300 uppercase tracking-wider cursor-default transition-all duration-300 hover:bg-white/[0.06]"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ━━━ SECTION 5: WHY DORAAI ━━━ */}
        <section id="why-doraai" aria-label="Why choose DoraAI" className="relative z-10 py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeading
              eyebrow="Advantages"
              title="Why DoraAI"
              description="Designed for developers, startups, and creators who want to build modern websites faster with AI."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {WHY_CARDS.map((card, i) => (
                <GlassCard key={card.title} delay={i * 0.1} className="text-left">
                  <span className="text-3xl mb-4 block" role="img" aria-label={card.title}>
                    {card.emoji}
                  </span>
                  <h3 className="font-bold text-base mb-2 text-white">{card.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{card.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ SECTION 6: METRICS ━━━ */}
        <section id="metrics" aria-label="Project metrics" className="relative z-10 py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
            >
              {METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                >
                  <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {m.value}
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {m.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ━━━ SECTION 7: CTA ━━━ */}
        <section id="cta" aria-label="Call to action" className="relative z-10 py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl p-px bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent"
            >
              <div className="rounded-3xl bg-[#070709]/90 backdrop-blur-xl p-10 md:p-16 text-center border border-white/[0.04]">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
                  Turn Your Ideas Into Websites
                </h2>
                <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
                  Generate modern, responsive websites powered by advanced AI.
                </p>
                <motion.button
                  onClick={handleStartBuilding}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(99, 102, 241, 0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Generate your website"
                  className="group inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl font-bold text-sm uppercase tracking-wider text-white cursor-pointer shadow-lg shadow-indigo-500/20 transition-all duration-300"
                >
                  <span>Generate Your Website</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ━━━ SECTION 8: FOOTER ━━━ */}
        <footer className="relative z-10 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

              {/* Branding */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img src="/ai2.png" className="w-7 h-7 object-contain" alt="DoraAI logo" />
                  <span className="font-bold text-lg bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                    DoraAI
                  </span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
                  AI Website Builder powered by advanced AI.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Quick Links</h4>
                <nav aria-label="Footer navigation">
                  <ul className="space-y-2.5">
                    {FOOTER_LINKS.map(link => (
                      <li key={link.label}>
                        <button
                          onClick={() => navigate(link.path)}
                          className="text-sm text-zinc-500 hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Built With */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Technology</h4>
                <ul className="space-y-2.5">
                  {FOOTER_TECH.map(tech => (
                    <li key={tech} className="text-sm text-zinc-500">{tech}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-white/[0.06] text-center">
              <p className="text-xs text-zinc-600">
                © 2026 DoraAI. Built by Suprojeet Sonar.
              </p>
            </div>
          </div>
        </footer>

      </main>

      {openLogin && (
        <LoginModal
          open={openLogin}
          onClose={() => setOpenLogin(false)}
        />
      )}
    </>
  )
}

export default Home