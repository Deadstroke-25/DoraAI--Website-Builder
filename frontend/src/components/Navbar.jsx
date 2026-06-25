import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import LoginModal from "./LoginModal"
import { useDispatch, useSelector } from "react-redux"
import { Coins } from "lucide-react"
import axios from "axios"
import { setUserData } from "../redux/userSlice"
import { useNavigate } from "react-router-dom"

const Navbar = () => {

  const [openLogin, setOpenLogin] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)

  const { userData } = useSelector(state => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
        { withCredentials: true }
      )

      dispatch(setUserData(null))
      setOpenProfile(false)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-4 left-4 right-4 z-50 rounded-2xl backdrop-blur-xl bg-[#030303]/60 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer bg-white/[0.03] p-1.5 px-3.5 rounded-xl border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.06] transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
          >
            <img src="/ai2.png" className="w-6 h-6 object-contain hover:rotate-12 transition-transform duration-300" />

            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
              Dora AI
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Credits */}
            {userData && (
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
            )}

            {/* Profile OR Login */}
            {userData ? (

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

            ) : (

              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => setOpenLogin(true)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-semibold text-xs uppercase tracking-wider text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-300 cursor-pointer"
              >
                Login
              </motion.button>

            )}

          </div>

        </div>
      </motion.nav>

      {openLogin && (
        <LoginModal
          open={openLogin}
          onClose={() => setOpenLogin(false)}
        />
      )}
    </>
  )
}

export default Navbar





