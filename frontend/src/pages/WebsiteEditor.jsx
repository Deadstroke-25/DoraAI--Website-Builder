import axios from 'axios'
import { ArrowLeft, Code2, MessageSquare, Monitor, Rocket, Send, X, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react';

const thinkingSteps = [
    "Understanding your request...",
    "Planning layout changes...",
    "Improving responsiveness...",
    "Applying animations...",
    "Finalizing Update..."
]

const WebsiteEditor = () => {
    const navigate = useNavigate()
    const [website, setWebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const { id } = useParams()
    const iframeRef = useRef(null)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [thinkingIndex, setThinkingIndex] = useState(0)
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [showChat, setShowChat] = useState(false)


    const handleDeploy = async () => {
    try {
         const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/deploy/${website._id}`,{withCredentials:true})
         window.open(`${result.data.url}`,"_blank")
         
    } catch (error) {
         console.log(error)
    }
  }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setThinkingIndex((i) => (i + 1) % thinkingSteps.length)
        }, 1200)
        return () => clearInterval(intervalId)
    }, [updateLoading])

    const handleUpdate = async () => {
        setMessages((m) => [...m, { role: "user", content: prompt }])
        setUpdateLoading(true)
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/website/update/${id}`, { prompt }, { withCredentials: true })
            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            setCode(result.data.code)
        } catch (error) {
            console.log(error)
        } finally {
            setUpdateLoading(false)
        }
    }

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/getbyid/${id}`, { withCredentials: true })
                setWebsite(result.data.website)
                setCode(result.data.website.latestCode)
                setMessages(result.data.website.conversation)
            } catch (error) {
                setError(error.response.data.message)
                console.log(error)
            }
        }
        handleGetWebsite()
    }, [id])

    useEffect(() => {
        if (!iframeRef.current || !code) return;
        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
        return () => URL.revokeObjectURL(url)
    }, [code])

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-red-400'>{error}</div>
        )
    }
    if (!website) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-white'>Loading...</div>
        )
    }
    return (
        <div className='h-screen w-screen flex bg-[#030303] text-white overflow-hidden font-sans'>
            {/* Sidebar chat */}
            <aside className='hidden lg:flex w-96 flex-col border-r border-white/[0.06] bg-[#070709]/80 backdrop-blur-xl'>
                <Header />
                <div className='flex-1 overflow-y-auto px-4 py-6 space-y-4'>
                    {messages.map((m, i) => {
                        const isUser = m.role === "user";
                        return (
                            <div key={i} className={`max-w-[85%] ${isUser ? "ml-auto" : "mr-auto"}`}>
                                <div className={`px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm transition-all duration-300
                                    ${isUser 
                                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none shadow-indigo-500/10" 
                                        : "bg-white/5 border border-white/[0.08] text-zinc-200 rounded-tl-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]"
                                    }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        )
                    })}
                    {updateLoading && (
                        <div className='max-w-[85%] mr-auto'>
                            <div className='flex items-center gap-2.5 px-4 py-3 rounded-2xl rounded-tl-none text-xs bg-white/5 border border-white/[0.08] text-indigo-400 italic shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]'>
                                <Loader2 size={12} className="animate-spin text-indigo-400 shrink-0" />
                                <span>{thinkingSteps[thinkingIndex]}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className='p-4 border-t border-white/[0.06] bg-black/20'>
                    <div className='flex gap-2 items-center'>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={1}
                            placeholder='Describe changes to your site...'
                            className='flex-1 resize-none rounded-xl px-4 py-3 bg-black/40 border border-white/[0.08] text-xs md:text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-300' 
                        />
                        <motion.button 
                            disabled={updateLoading} 
                            onClick={handleUpdate} 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='p-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer'
                        >
                            <Send size={14} />
                        </motion.button>
                    </div>
                </div>
            </aside>

            {/* preview */}
            <div className='flex-1 flex flex-col bg-zinc-950'>
                <div className='h-16 px-6 flex justify-between items-center border-b border-white/[0.06] bg-[#070709]/80 backdrop-blur-xl'>
                    <div className='flex items-center gap-3'>
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className='p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer text-zinc-400 hover:text-white lg:hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]'
                            title="Back to Dashboard"
                        >
                            <ArrowLeft size={14} />
                        </button>
                        <span className='text-xs uppercase tracking-wider font-bold text-zinc-400'>Live Preview</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        {!website.deployed && (
                            <motion.button 
                                onClick={handleDeploy}
                                whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(99, 102, 241, 0.25)" }}
                                whileTap={{ scale: 0.98 }}
                                className='flex items-center gap-2 px-4.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg cursor-pointer'
                            >
                                <Rocket size={12} />
                                <span>Deploy</span>
                            </motion.button>
                        )}
                      
                        <button onClick={() => setShowChat(true)} className='p-2.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition lg:hidden'><MessageSquare size={16} /></button>
                        <button onClick={() => setShowCode(true)} className='p-2.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition' title="View Source"><Code2 size={16} /></button>
                        <button onClick={() => setShowFullPreview(true)} className='p-2.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition' title="Fullscreen Preview"><Monitor size={16} /></button>
                    </div>
                </div>
                <iframe ref={iframeRef} className='flex-1 w-full bg-white border-none' sandbox='allow-scripts allow-same-origin allow-forms'/>
            </div>

            {/* mobile chat preview */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ cubicBezier: [0.16, 1, 0.3, 1], duration: 0.5 }}
                        className='fixed inset-0 z-50 flex flex-col bg-[#070709]'
                    >
                        <Header />
                        <div className='flex-1 overflow-y-auto px-4 py-6 space-y-4'>
                            {messages.map((m, i) => {
                                const isUser = m.role === "user";
                                return (
                                    <div key={i} className={`max-w-[85%] ${isUser ? "ml-auto" : "mr-auto"}`}>
                                        <div className={`px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm
                                            ${isUser 
                                                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none shadow-indigo-500/10" 
                                                : "bg-white/5 border border-white/[0.08] text-zinc-200 rounded-tl-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]"
                                            }`}
                                        >
                                            {m.content}
                                        </div>
                                    </div>
                                )
                            })}
                            {updateLoading && (
                                <div className='max-w-[85%] mr-auto'>
                                    <div className='flex items-center gap-2.5 px-4 py-3 rounded-2xl rounded-tl-none text-xs bg-white/5 border border-white/[0.08] text-indigo-400 italic shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]'>
                                        <Loader2 size={12} className="animate-spin text-indigo-400 shrink-0" />
                                        <span>{thinkingSteps[thinkingIndex]}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='p-4 border-t border-white/[0.06] bg-black/20 pb-8'>
                            <div className='flex gap-2 items-center'>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={1}
                                    placeholder='Describe changes...'
                                    className='flex-1 resize-none rounded-xl px-4 py-3 bg-black/40 border border-white/[0.08] text-xs md:text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500/80 transition-all duration-300' 
                                />
                                <button disabled={updateLoading} onClick={handleUpdate} className='p-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 transition cursor-pointer'><Send size={14} /></button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ cubicBezier: [0.16, 1, 0.3, 1], duration: 0.4 }}
                        className='fixed inset-y-0 right-0 w-full lg:w-[45%] z-50 flex flex-col bg-[#1e1e1e] border-l border-white/[0.06] shadow-2xl shadow-black/80'
                    >
                        <div className='h-16 px-6 flex justify-between items-center border-b border-white/[0.06] bg-[#1a1a1a]'>
                            <span className='text-xs font-bold uppercase tracking-wider text-zinc-400'>index.html</span>
                            <button onClick={() => setShowCode(false)} className='p-2 rounded-lg hover:bg-white/5 transition text-zinc-400 hover:text-white cursor-pointer'><X size={16} /></button>
                        </div>
                        <Editor theme='vs-dark' value={code} language='html' onChange={(v) => setCode(v)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFullPreview && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 bg-black z-50'
                    >
                        <iframe className='w-full h-full bg-white border-none' srcDoc={code} sandbox='allow-scripts allow-same-origin allow-forms'></iframe>
                        <button onClick={() => setShowFullPreview(false)} className='absolute top-4 right-4 p-2 bg-black/70 border border-white/10 hover:bg-black text-zinc-300 hover:text-white rounded-lg transition cursor-pointer'><X size={18} /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    function Header() {
        return (
            <div className='h-16 px-6 flex items-center gap-3 border-b border-white/[0.06] bg-[#070709]/80 backdrop-blur-xl'>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className='p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer text-zinc-400 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]'
                    title="Back to Dashboard"
                >
                    <ArrowLeft size={14} />
                </button>
                <span className='font-bold text-sm truncate flex-1 text-zinc-100'>{website.title}</span>
                <button onClick={() => setShowChat(false)} className='lg:hidden p-2 text-zinc-400 hover:text-white transition cursor-pointer'><X size={16}/></button>
            </div>
        )
    }


}

export default WebsiteEditor
