import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext.jsx";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize2() {
    const { serverUrl, userData, setUserData, backendImage, selectedImage } = useContext(userDataContext);
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdateAssistant = async () => {
        if (!assistantName) return;
        setLoading(true);
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);
            if (backendImage) {
                formData.append("assistantImage", backendImage);
            } else {
                formData.append("imageUrl", selectedImage);
            }
            
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true });
            setLoading(false);
            setUserData(result.data);
            navigate("/");
        } catch (error) {
            setLoading(false);
            console.error("Update error:", error);
        }
    }

    return (
        <div className="w-full h-screen bg-[#050505] flex justify-center items-center flex-col p-10 relative font-mono overflow-hidden">
            {/* HUD Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <MdKeyboardBackspace 
                className="absolute top-10 left-10 text-blue-500 cursor-pointer w-8 h-8 hover:text-white transition-colors z-50" 
                onClick={() => navigate("/customize")} 
            />

            <div className="text-center mb-12 relative z-10">
                <div className="w-16 h-1 bg-blue-500 mx-auto mb-6"></div>
                <h1 className="text-white text-3xl font-thin tracking-[0.3em] uppercase">
                    Neural Identity <span className="text-blue-500 font-bold">Sync</span>
                </h1>
                <p className="text-blue-400/40 text-[10px] tracking-[0.4em] uppercase mt-2">Protocol: NAME_INITIALIZATION</p>
            </div>
            
            <div className="w-full max-w-[600px] space-y-2 relative z-10">
                <label className="text-blue-500/50 text-[10px] uppercase tracking-widest ml-4">Assistant Codename</label>
                <input 
                    type="text" 
                    placeholder="ENTER CODENAME..." 
                    className="w-full h-[65px] bg-white/5 border border-blue-500/10 text-white placeholder:text-white/10 px-8 rounded-full outline-none focus:border-blue-500/50 transition-all text-xl tracking-widest" 
                    required 
                    onChange={(e) => setAssistantName(e.target.value)} 
                    value={assistantName} 
                />
            </div>

            {assistantName && (
                <button 
                    className="group relative px-20 py-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full tracking-[0.4em] uppercase transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] mt-12 z-10" 
                    disabled={loading} 
                    onClick={handleUpdateAssistant}
                >
                    {loading ? "INITIALIZING..." : "FINALIZE PROTOCOL"}
                </button>
            )}
            
            <div className="absolute bottom-12 left-12 opacity-5">
                <p className="text-blue-500 text-[10px] tracking-[0.4em]">SYNC_READY // AWAITING_CONFIRMATION</p>
            </div>
        </div>
    )
}

export default Customize2;