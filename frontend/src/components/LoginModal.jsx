import React from 'react'
import { motion } from 'motion/react'
import { Sparkles, X } from 'lucide-react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const LoginModal = ({ open, onClose }) => {
    const dispatch = useDispatch()
    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const idToken = await result.user.getIdToken();
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`, {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL,
                idToken: idToken
            }, { withCredentials: true })
            dispatch(setUserData(data.user))
            onClose()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className='fixed inset-0 flex z-50 items-center justify-center bg-black/80 backdrop-blur-xl px-4'
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
                        className='relative w-full max-w-md p-px rounded-3xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='relative rounded-3xl bg-[#070709]/95 border border-white/[0.06] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden'>
                            {/* Glowing Blobs */}
                            <motion.div
                                animate={{ 
                                    x: [0, 20, 0],
                                    y: [0, -20, 0],
                                    opacity: [0.2, 0.3, 0.2] 
                                }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className='absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none'
                            />
                            <motion.div
                                animate={{ 
                                    x: [0, -20, 0],
                                    y: [0, 20, 0],
                                    opacity: [0.15, 0.25, 0.15] 
                                }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                className='absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none'
                            />
                            
                            {/* Close Button */}
                            <button 
                                onClick={onClose} 
                                className='absolute top-5 right-5 z-20 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all text-zinc-400 cursor-pointer'
                            >
                                <X size={16} />
                            </button>
                            
                            <div className='relative px-8 pt-14 pb-10 text-center z-10'>
                                <div
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 border border-white/[0.08] rounded-full bg-white/5 backdrop-blur-md"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                                        AI Website Builder
                                    </span>
                                </div>
                                
                                <h2 className='text-2xl md:text-3xl font-extrabold leading-tight mb-3 text-white'>
                                    Welcome to{" "}
                                    <span className='bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
                                        Dora AI
                                    </span>
                                </h2>
                                <p className='text-zinc-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto'>
                                    Sign in to access your dashboard, credits, and start building high-performance sites.
                                </p>
                                
                                <motion.button
                                    onClick={handleGoogleAuth}
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className='group relative w-full h-12 rounded-xl bg-white text-black font-bold shadow-lg overflow-hidden flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer'
                                >
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" alt="Google Logo" className='h-5 w-5' />
                                    <span>Continue with Google</span>
                                </motion.button>

                                <div className='flex items-center gap-4 my-8'>
                                    <div className='h-px flex-1 bg-white/[0.06]' />
                                    <span className='text-[10px] font-semibold uppercase tracking-wider text-zinc-600'>Secure Authorization</span>
                                    <div className='h-px flex-1 bg-white/[0.06]' />
                                </div>

                                <p className='text-[11px] text-zinc-500 leading-relaxed px-4'>
                                    By proceeding, you agree to our{" "}
                                    <span className='text-zinc-400 hover:text-white underline cursor-pointer transition-colors'>Terms of Service</span>{" "}
                                    and{" "}
                                    <span className='text-zinc-400 hover:text-white underline cursor-pointer transition-colors'>Privacy Policy</span>.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}

export default LoginModal
