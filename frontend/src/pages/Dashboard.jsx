import { ArrowLeft, Check, Rocket, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from 'motion/react'
import {  useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate()
  const [websites, setWebsites] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)
  const { userData } = useSelector(state => state.user)

  const handleDeploy = async (id) => {
    try {
         const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/deploy/${id}`,{withCredentials:true})
         window.open(`${result.data.url}`,"_blank")
         setWebsites((prev)=>prev.map((w)=>w._id === id ? {...w, deployed:true, deployUrl:result.data.url}:w))
    } catch (error) {
         console.log(error)
    }
  }

  useEffect(() => {
    const handleGetAllWebsite = async () => {
      try {
        setLoading(true)
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/getall`, { withCredentials: true })
        setWebsites(result.data.websites)
      } catch (error) {
        setError(error.response.data.message)
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    handleGetAllWebsite()
  }, [])

  const handleCopy = async(site)=>{
      await navigator.clipboard.writeText(site.deployUrl)
      setCopiedId(site._id)
      setTimeout(()=>setCopiedId(null), 2000)
  }
  return (
    <div className="relative min-h-screen bg-[#030303] text-white overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 left-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[120px]" 
        />
      </div>

      {/* Header */}
      <div className="sticky top-4 left-4 right-4 mx-4 z-40 rounded-2xl backdrop-blur-xl bg-[#030303]/60 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all text-zinc-400 cursor-pointer">
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-base font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Dashboard</h1>
          </div>

          <motion.button 
            whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/generate")} 
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/10 cursor-pointer"
          >
            + New Website
          </motion.button>

        </div>
      </div>

      <div className="px-6 py-12 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-white/[0.06] pb-8"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Workspace</p>
          <h1 className="text-3xl font-extrabold text-white">Welcome, {userData.name}</h1>
        </motion.div>

        {loading && <div className="mt-24 text-center text-sm text-zinc-400 animate-pulse">Loading your designs...</div>}
        {error && !loading && <div className="mt-24 text-center text-sm text-red-400">⚠️ {error}</div>}
        {websites?.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-24 text-center border border-white/[0.06] bg-white/[0.01] rounded-3xl p-12 max-w-md mx-auto"
          >
            <p className="text-sm text-zinc-400 mb-6">You haven't generated any websites yet.</p>
            <button 
              onClick={() => navigate("/generate")}
              className="px-6 py-3 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition"
            >
              Build Your First Site
            </button>
          </motion.div>
        )}
        {websites?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {websites.map((w, i) => {
              const copied = copiedId === w._id
              return (
                <motion.div
                  key={w._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/editor/${w._id}`)}
                  className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300 flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-pointer"
                >
                  <div className="relative h-44 bg-black overflow-hidden border-b border-white/[0.06]">
                    <iframe 
                      srcDoc={w.latestCode} 
                      className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 group-hover:bg-gradient-to-t group-hover:from-black/90 group-hover:via-black/10 group-hover:to-black/30 transition-all duration-300" />
                    
                    {/* Hover indicator badge */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider shadow-xl">
                        Open Editor
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <h3 className="text-base font-bold text-zinc-100 group-hover:text-white line-clamp-1 transition-colors">{w.title}</h3>
                    <p className="text-xs text-zinc-500">
                      Updated {new Date(w.updatedAt).toLocaleDateString()}
                    </p>
                    
                    {!w.deployed ? (
                      <motion.button 
                        onClick={(e) => { e.stopPropagation(); handleDeploy(w._id); }} 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white cursor-pointer shadow-lg shadow-indigo-500/10"
                      >
                        <Rocket size={14} />
                        Deploy Site
                      </motion.button>
                    ) : (
                      <motion.button 
                        onClick={(e) => { e.stopPropagation(); handleCopy(w); }} 
                        whileTap={{ scale: 0.96 }}
                        className={`mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border
                          ${copied 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                            : "bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/[0.08]"
                          }`}
                      >
                        {copied ? (
                          <>
                            <Check size={14} className="text-emerald-400" />
                            <span>Link Copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={14} />
                            <span>Share Link</span>
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;