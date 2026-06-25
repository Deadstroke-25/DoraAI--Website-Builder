import { ArrowLeft, Sparkles, Wand2, Layout, Monitor, ShoppingBag, Loader2, CheckCircle2, Circle, Coins } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const PHASES = [
    "Analyzing your idea...",
    "Designing layout and structure...",
    "Writing HTML and CSS...",
    "Adding animation and interaction...",
    "Final quality checks..."
]

const PRESET_PROMPTS = [
    {
        label: "Tech Startup",
        icon: Sparkles,
        text: "Create a modern, responsive landing page for a fictional tech startup called 'NovaTech'. Requirements: Use a minimalist design with a blue and purple gradient theme. Fully responsive for desktop, tablet, and mobile. Use smooth animations and hover effects."
    },
    {
        label: "Design Agency",
        icon: Layout,
        text: "Design a high-end portfolio website for a creative design agency called 'Studio X'. Include a dark mode aesthetic, bold typography, sleek grid layouts for project showcases, and a clean contact form."
    },
    {
        label: "SaaS Platform",
        icon: Monitor,
        text: "Build a sleek SaaS landing page for an AI-powered project management tool called 'TaskAI'. Include a hero section with a product screenshot mockup, a 3-column features section, a pricing table with toggles, and a FAQ accordion."
    },
    {
        label: "E-Commerce",
        icon: ShoppingBag,
        text: "Build a premium e-commerce landing page for a boutique sneaker brand called 'SoleFoot'. Feature a hot product showcase with custom hover effects, a slider of popular collections, customer testimonials, and an interactive newsletter signup."
    }
]

const Generate = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")
    const [openProfile, setOpenProfile] = useState(false)
    const { userData } = useSelector(state => state.user)

    const handleLogout = async () => {
        try {
            await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
                { withCredentials: true }
            )
            dispatch(setUserData(null))
            setOpenProfile(false)
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    const handleGenerateWebsite = async () => {
        try {
            setLoading(true)
            setError("")
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/website/generate`,
                { prompt },
                { withCredentials: true }
            )
            setProgress(100)
            dispatch(setUserData({ ...userData, credits: res.data.remainingCredits }))
            navigate(`/editor/${res.data.websiteId}`)
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!loading) {
            setPhaseIndex(0)
            setProgress(0)
            return
        }

        let value = 0
        let phase = 0

        const interval = setInterval(() => {
            const increment =
                value < 20
                    ? Math.random() * 1.5
                    : value < 60
                        ? Math.random() * 1.2
                        : Math.random() * 0.6

            value += increment
            if (value >= 95) value = 95

            phase = Math.min(
                Math.floor((value / 100) * PHASES.length),
                PHASES.length - 1
            )

            setProgress(Math.floor(value))
            setPhaseIndex(phase)
        }, 1200)

        return () => clearInterval(interval)
    }, [loading])

    return (
        <div className='relative min-h-screen bg-[#030303] text-white overflow-hidden font-sans pb-24'>
            
            {/* Ambient Background Glowing Blobs */}
            <div className='absolute inset-0 pointer-events-none z-0'>
                <motion.div 
                    animate={{
                        x: [0, 80, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className='absolute -top-40 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]' 
                />
                <motion.div 
                    animate={{
                        x: [0, -60, 0],
                        y: [0, 80, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className='absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px]' 
                />
                <motion.div 
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 60, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 4
                    }}
                    className='absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[120px]' 
                />
            </div>

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.04] z-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
            />

            {/* Header */}
            <div className="sticky top-4 left-4 right-4 mx-4 z-40 rounded-2xl backdrop-blur-xl bg-[#030303]/60 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer text-zinc-400 hover:text-white"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <span className="font-semibold text-sm uppercase tracking-wider text-zinc-300">
                            Creator Hub
                        </span>
                    </div>

                    {/* Credits & Profile */}
                    {userData && (
                        <div className="flex items-center gap-4">
                            {/* Credits Badge */}
                            <motion.div
                                whileHover={{ scale: 1.03, borderColor: "rgba(234, 179, 8, 0.4)" }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/pricing")}
                                className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-yellow-500/10 transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.03)]"
                            >
                                <Coins size={14} className="text-yellow-400 animate-pulse" />
                                <span className="text-yellow-400">{userData.credits}</span>
                                <span className="text-zinc-400">Credits</span>
                                <span className="text-yellow-400 font-bold ml-0.5">+</span>
                            </motion.div>

                            {/* Profile Avatar */}
                            <div className="relative">
                                <button
                                    onClick={() => setOpenProfile(!openProfile)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <img
                                        referrerPolicy="no-referrer"
                                        className="w-9 h-9 rounded-xl border border-white/15 object-cover hover:border-indigo-500/50 hover:scale-105 transition-all duration-300"
                                        src={
                                            userData?.avatar ||
                                            `https://ui-avatars.com/api/?name=${userData.name}`
                                        }
                                    />
                                </button>

                                <AnimatePresence>
                                    {openProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute right-0 mt-3 w-60 rounded-xl bg-[#0a0a0c] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                                                <p className="text-sm font-semibold truncate text-white">
                                                    {userData.name}
                                                </p>
                                                <p className="text-xs text-zinc-500 truncate mt-0.5">
                                                    {userData.email}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => { navigate("/dashboard"); setOpenProfile(false); }}
                                                className="w-full px-4 py-3 text-left text-sm hover:bg-white/[0.04] text-zinc-300 hover:text-white transition-colors"
                                            >
                                                Dashboard
                                            </button>

                                            <button
                                                onClick={() => { navigate("/pricing"); setOpenProfile(false); }}
                                                className="md:hidden w-full px-4 py-3 flex items-center gap-2 text-zinc-300 hover:text-white text-sm hover:bg-white/[0.04] transition-colors"
                                            >
                                                <Coins size={14} className="text-yellow-400" />
                                                {userData.credits} Credits
                                            </button>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-left text-sm hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors border-t border-white/[0.04]"
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className='relative z-10 max-w-4xl mx-auto px-6 pt-20'>
                
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='text-center mb-10'
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 border border-white/[0.08] rounded-full bg-white/5 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">AI Synthesizer</span>
                    </div>
                    <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight'>
                        Build Website with
                        <span className='block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-1'>
                            Real AI Power
                        </span>
                    </h1>
                    <p className='text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed'>
                        Dora AI handles design systems, responsiveness, animations, and typography to build client-ready designs.
                    </p>
                </motion.div>

                {/* Main Action Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className='relative rounded-3xl p-px bg-gradient-to-b from-white/15 to-transparent shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
                >
                    <div className='relative rounded-3xl bg-[#070709]/95 border border-white/[0.06] backdrop-blur-2xl p-6 md:p-8 overflow-hidden'>
                        
                        {/* Preset Chips */}
                        <div className="mb-8">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-4 text-center">
                                Try a Preset Prompt
                            </span>
                            <div className="flex flex-wrap justify-center gap-2.5">
                                {PRESET_PROMPTS.map((p) => {
                                    const Icon = p.icon;
                                    return (
                                        <button
                                            key={p.label}
                                            onClick={() => setPrompt(p.text)}
                                            className="flex items-center gap-2 px-4 py-2 text-xs rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
                                        >
                                            <Icon size={13} className="text-indigo-400" />
                                            <span className="text-zinc-300 font-semibold">{p.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <label className='text-[10px] font-bold uppercase tracking-wider text-zinc-400'>
                                    Describe Your Website
                                </label>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                    {prompt.length} / 5000 chars
                                </span>
                            </div>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className='w-full h-44 p-5 rounded-2xl bg-black/40 border border-white/[0.08] outline-none resize-none text-sm leading-relaxed text-zinc-200 placeholder-zinc-500 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-300'
                                placeholder='Describe your target audience, services, design aesthetic (e.g. minimalist dark theme with blue accents)...'
                                maxLength={5000}
                                disabled={loading}
                            />
                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -5 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className='mt-3 text-xs text-red-400 flex items-center gap-1.5'
                                >
                                    <span>⚠️</span> {error}
                                </motion.p>
                            )}
                        </div>

                        {/* Action Button */}
                        <div className='flex justify-center'>
                            <motion.button
                                onClick={handleGenerateWebsite}
                                whileHover={prompt.trim() && !loading ? { scale: 1.02, boxShadow: "0 0 25px rgba(99, 102, 241, 0.35)" } : {}}
                                whileTap={prompt.trim() && !loading ? { scale: 0.98 } : {}}
                                disabled={!prompt.trim() || loading}
                                className={`px-12 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer
                                ${
                                    prompt.trim() && !loading
                                        ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/10"
                                        : "bg-white/5 text-zinc-500 border border-white/[0.08] cursor-not-allowed"
                                }`}
                            >
                                <span className="flex items-center gap-2 justify-center">
                                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                                    {loading ? "Generating Magic..." : "Generate Website"}
                                </span>
                            </motion.button>
                        </div>

                        {/* Loading Phase Tracker */}
                        <AnimatePresence>
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className='max-w-md mx-auto mt-8 border-t border-white/10 pt-6'
                                >
                                    {/* Progress Tracker */}
                                    <div className="space-y-3 mb-6">
                                        {PHASES.map((p, index) => {
                                            const isDone = phaseIndex > index;
                                            const isActive = phaseIndex === index;
                                            return (
                                                <div 
                                                    key={index} 
                                                    className={`flex items-center gap-3 text-xs md:text-sm transition-all duration-300
                                                    ${isDone ? "text-green-400" : isActive ? "text-indigo-300 font-medium" : "text-zinc-600"}`}
                                                >
                                                    {isDone ? (
                                                        <CheckCircle2 size={16} className="text-green-400 shrink-0 animate-pulse" />
                                                    ) : isActive ? (
                                                        <Loader2 size={16} className="text-indigo-400 animate-spin shrink-0" />
                                                    ) : (
                                                        <Circle size={16} className="text-zinc-700 shrink-0" />
                                                    )}
                                                    <span className={isActive ? "translate-x-1 transition-transform" : ""}>{p}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Slider Progress Bar */}
                                    <div className='flex justify-between mb-2 text-xs text-zinc-400 font-mono'>
                                        <span>Current Status</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className='h-1.5 w-full bg-white/5 border border-white/5 rounded-full overflow-hidden'>
                                        <motion.div
                                            animate={{ width: `${progress}%` }}
                                            transition={{ ease: "easeOut", duration: 0.8 }}
                                            className='h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                        />
                                    </div>
                                    <div className='text-center text-[10px] text-zinc-500 mt-3'>
                                        Estimated construction time: ~8-12 minutes
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </motion.div>

            </div>
        </div>
    )
}

export default Generate