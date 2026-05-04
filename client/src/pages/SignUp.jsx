import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, { name, email, password }, { withCredentials: true });
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Initialization Failed");
    }
  };

  return (
    <div className="w-full h-screen bg-[#050505] flex justify-center items-center relative font-mono overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="relative z-10 w-[90%] max-w-[450px] p-10 bg-black/40 backdrop-blur-3xl border border-blue-500/20 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        <div className="text-center mb-10">
            <div className="w-16 h-1 bg-blue-500 mx-auto mb-6"></div>
            <h1 className="text-blue-500 text-3xl font-thin tracking-[0.3em] uppercase">User <span className="text-white font-bold">Registration</span></h1>
            <p className="text-blue-400/40 text-[10px] tracking-[0.4em] uppercase mt-2">Protocol: NEW_USER_SYNC</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-1">
            <label className="text-blue-500/50 text-[9px] uppercase tracking-widest ml-4">Subject Name</label>
            <input
              type="text"
              placeholder="Name"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full h-[50px] bg-white/5 border border-blue-500/10 text-white placeholder:text-white/10 px-6 rounded-full outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-blue-500/50 text-[9px] uppercase tracking-widest ml-4">Terminal Email</label>
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full h-[50px] bg-white/5 border border-blue-500/10 text-white placeholder:text-white/10 px-6 rounded-full outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-blue-500/50 text-[9px] uppercase tracking-widest ml-4">Neural Passkey</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full h-[50px] bg-white/5 border border-blue-500/10 text-white placeholder:text-white/10 px-6 rounded-full outline-none focus:border-blue-500/50 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-500/30 hover:text-blue-400">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center">{error}</p>}

          <button 
            disabled={loading}
            className="w-full h-[60px] mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full tracking-[0.4em] uppercase transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            {loading ? "Syncing..." : "Create Account"}
          </button>

          <p className="text-white/20 text-[10px] text-center uppercase tracking-widest cursor-pointer hover:text-blue-400 mt-4" onClick={() => navigate("/signin")}>
            Already Enrolled? <span className="text-blue-500">Sign In</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;