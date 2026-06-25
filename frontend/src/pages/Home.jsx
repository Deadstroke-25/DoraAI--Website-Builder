import { ArrowRight, Sparkles, Zap, LayoutTemplate, Download } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState } from "react"
import Navbar from "../components/Navbar"
import LoginModal from "../components/LoginModal"

const Home = () => {    
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const [openLogin, setOpenLogin] = useState(false)

    const handleStartBuilding = () => {
        if (userData) {
            navigate('/generate')
        } else {
            setOpenLogin(true)
        }
    }

  return (
    <>
    <Navbar/>
    <section className="relative min-h-screen bg-[#030303] text-white overflow-hidden flex flex-col justify-center">

      {/* Ambient Moving Mesh/Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" 
        />
        <motion.div 
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" 
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-20 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-white/[0.08] rounded-full bg-white/5 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Next-Gen AI Website Builder
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight max-w-4xl mx-auto"
        >
          Build Professional Websites
          <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Powered by Gemini AI
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-2xl mx-auto mt-6 text-sm md:text-base text-zinc-400 leading-relaxed"
        >
          Describe your vision and watch our AI designer assemble beautiful layouts, styles, 
          and layouts instantly. Export code or launch immediately.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10"
        >
          <motion.button 
            onClick={handleStartBuilding} 
            whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(99, 102, 241, 0.45)" }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl font-bold text-sm uppercase tracking-wider text-white transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-500/25"
          >
            <span>Start Building</span>
            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 border border-white/10 rounded-xl font-semibold text-sm uppercase tracking-wider text-zinc-300 hover:text-white transition-all duration-300"
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:-translate-y-2 group"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="text-yellow-400 w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">
              Instant Generation
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Describe your website prompt and witness state-of-the-art designs created in seconds.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:-translate-y-2 group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <LayoutTemplate className="text-indigo-400 w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">
              Responsive Layouts
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your generated pages scale correctly and dynamically across all standard formats.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:-translate-y-2 group"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Download className="text-pink-400 w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">
              Export Clean Code
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Download formatted HTML, CSS, and JS styles directly or deploy your site to live hosting.
            </p>
          </motion.div>

        </div>
      </div>
    </section>

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