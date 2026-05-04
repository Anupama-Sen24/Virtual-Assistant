import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, { email, password }, { withCredentials: true });
      setUserData(result.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Access Denied");
    }
  };

  return (
    <div className="w-full h-screen bg-[#050505] flex justify-center items-center relative font-mono overflow-hidden">
      {/* HUD Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="relative z-10 w-[90%] max-w-[450px] p-10 bg-black/40 backdrop-blur-3xl border border-blue-500/20 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        <div className="text-center mb-10">
            <div className="w-16 h-1 bg-blue-500 mx-auto mb-6"></div>
            <h1 className="text-blue-500 text-3xl font-thin tracking-[0.3em] uppercase">System <span className="text-white font-bold">Log In</span></h1>
            <p className="text-blue-400/40 text-[10px] tracking-[0.4em] uppercase mt-2">Protocol: AUTH_SECURE_V4</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="space-y-2">
            <label className="text-blue-500/50 text-[10px] uppercase tracking-widest ml-4">Terminal ID (Email)</label>
            <input
              type="email"
              placeholder="Enter Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full h-[55px] bg-white/5 border border-blue-500/10 text-white placeholder:text-white/10 px-6 rounded-full outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-blue-500/50 text-[10px] uppercase tracking-widest ml-4">Neural Key (Password)</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full h-[55px] bg-white/5 border border-blue-500/10 text-white placeholder:text-white/10 px-6 rounded-full outline-none focus:border-blue-500/50 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-500/30 hover:text-blue-400">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center">{error}</p>}

          <button 
            disabled={loading}
            className="w-full h-[60px] bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full tracking-[0.4em] uppercase transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>

          <p className="text-white/20 text-[10px] text-center uppercase tracking-widest cursor-pointer hover:text-blue-400 transition-colors" onClick={() => navigate("/signup")}>
            New User? <span className="text-blue-500">Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;