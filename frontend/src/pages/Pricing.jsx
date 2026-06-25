import { ArrowLeft, Check, Coins } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import LoginModal from '../components/LoginModal'


const plans = [
    {
        id: "free",
        name: "Free",
        price: '₹0',
        credits: 100,
        description: "Perfect to explore Dora ai",
        features: [
            "AI website generation",
            "Responsive html outputs",
            "Basic animations"
        ],
        popular: false,
        button: "Get Started"
    },
    {
        id: "pro",
        name: "Pro",
        price: '₹499',
        credits: 500,
        description: "For serious creators and freelancers",
        features: [
            "Everything in Free",
            "Faster Generations",
            "Edit and regenerate",
            "Download Source code"
        ],
        popular: true,
        button: "Upgrade to Pro"
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: '₹1499',
        credits: 1000,
        description: "For teams and power users",
        features: [
            "Unlimited Iterations",
            "Highest Priority",
            "Team Collaboration",
            "Dedicated Support"
        ],
        popular: false,
        button: "Contact Sales"
    },
]

const Pricing = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const [openLogin, setOpenLogin] = useState(false)

    const handlePayment = async (plan) => {
        if (plan.id === "free") {
            navigate("/dashboard")
            return
        }
        if (!userData) {
            setOpenLogin(true)
            return
        }
        try {  
            const result = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/payment/order`,
                {
                    planId: plan.id
                },
                {
                    withCredentials: true
                }
            );
           

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: result.data.amount,
                currency: result.data.currency,
                name: "Dora ai",
                description: `${plan.name} - ${plan.credits} Credits`,
                order_id: result.data.orderId,

                handler: async function (response) {
                    const verify = await axios.post(
                        `${import.meta.env.VITE_SERVER_URL}/api/payment/verify`,
                        response,
                        { withCredentials: true }
                    );

                    if (verify.data.success) {
                        dispatch(setUserData(verify.data.user));
                    }
                },
                theme: {
                    color: "#19173d"
                }
            }
            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            console.error(error)
            
        }
    }
    return (
        <div className='relative min-h-screen overflow-hidden bg-[#030303] text-white px-6 pt-20 pb-24 font-sans'>
            
            {/* Ambient Background Glows */}
            <div className='absolute inset-0 pointer-events-none z-0'>
                <div className='absolute -top-40 -left-40 w-125 h-125 bg-indigo-600/10 rounded-full blur-[130px]' />
                <div className='absolute bottom-0 right-0 w-125 h-125 bg-purple-600/10 rounded-full blur-[130px]' />
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

            {/* Back Button */}
            <button 
                onClick={() => navigate("/")} 
                className='relative z-10 mb-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]'
            >
                <ArrowLeft size={14} />
                <span>Back</span>
            </button>

            {/* Heading Section */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='relative z-10 max-w-4xl mx-auto text-center mb-16'
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 border border-white/[0.08] rounded-full bg-white/5 backdrop-blur-md">
                    <Coins className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Credits Portal</span>
                </div>
                <h1 className='text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight'>
                    Simple, transparent pricing
                </h1>
                <p className='text-zinc-400 text-sm max-w-md mx-auto leading-relaxed'>
                    Purchase credits one-time, generate websites anytime. Choose a plan tailored to your workspace needs.
                </p>
            </motion.div>

            {/* Pricing Cards Grid */}
            <div className='relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch'>
                {plans.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        whileHover={{ y: -8 }}
                        className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]
                            ${p.popular 
                                ? "border-indigo-500 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent shadow-2xl shadow-indigo-500/20" 
                                : "border-white/[0.06] bg-white/[0.02] hover:border-indigo-500/20 hover:bg-white/[0.04]"
                            }`}
                    >
                        <div>
                            {p.popular && (
                                <span className='absolute top-5 right-5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 animate-pulse'>
                                    Most Popular
                                </span>
                            )}
                            
                            <h2 className='text-lg font-bold text-zinc-100 mb-1'>{p.name}</h2>
                            <p className='text-zinc-500 text-xs mb-6'>{p.description}</p>
                            
                            <div className='flex items-baseline gap-1 mb-6 border-b border-white/[0.06] pb-6'>
                                <span className='text-4xl font-extrabold text-white'>{p.price}</span>
                                <span className='text-[10px] uppercase font-bold tracking-wider text-zinc-500'>/ one-time</span>
                            </div>
                            
                            <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-xs font-semibold text-yellow-400 mb-8'>
                                <Coins size={14} className='text-yellow-400' />
                                <span>{p.credits} Generation Credits</span>
                            </div>
                            
                            <ul className='space-y-4 mb-10'>
                                {p.features.map((f) => (
                                    <li key={f} className='flex items-center gap-3 text-xs text-zinc-300 font-medium'>
                                        <div className='w-4.5 h-4.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0'>
                                            <Check size={11} className='text-emerald-400' />
                                        </div>
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <motion.button
                            onClick={() => handlePayment(p)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border
                                ${p.popular 
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35" 
                                    : "bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white border-white/[0.08]"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {p.button}
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            {openLogin && (
                <LoginModal
                    open={openLogin}
                    onClose={() => setOpenLogin(false)}
                />
            )}
        </div>
    )
}

export default Pricing
