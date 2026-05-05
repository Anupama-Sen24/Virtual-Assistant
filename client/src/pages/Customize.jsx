import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext.jsx";
import Card from "../components/Card";
import image1 from "../assets/module1.png";
import image2 from "../assets/module2.jpg";
import image3 from "../assets/agent3.png";
import image5 from "../assets/module5.png";
import image6 from "../assets/module6.jpeg";
import image7 from "../assets/module7.jpeg";
import { MdKeyboardBackspace } from "react-icons/md";
import { RiImageAddLine } from "react-icons/ri";

function Customize() {
    const { 
        userData, 
        setbackendImage, 
        fontendImage, 
        setFrontendImage, 
        selectedImage, 
        setSelectedImage 
    } = useContext(userDataContext);
    
    const navigate = useNavigate();
    const inputImage = useRef();

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setbackendImage(file);
            setFrontendImage(URL.createObjectURL(file));
        }
    }

    return (
        <div className="w-full h-screen bg-[#050505] flex justify-center items-center flex-col p-10 relative font-mono overflow-hidden">
            {/* HUD Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <MdKeyboardBackspace 
                className="absolute top-10 left-10 text-blue-500 cursor-pointer w-8 h-8 hover:text-white transition-colors z-50" 
                onClick={() => navigate("/")} 
            />

            <div className="text-center mb-12 relative z-10">
                <div className="w-16 h-1 bg-blue-500 mx-auto mb-6"></div>
                <h1 className="text-white text-3xl font-thin tracking-[0.3em] uppercase">
                    Select Neural <span className="text-blue-500 font-bold">Module</span>
                </h1>
                <p className="text-blue-400/40 text-[10px] tracking-[0.4em] uppercase mt-2">Current Identity: {userData?.name}</p>
            </div>

            <div className="w-full max-w-[1000px] flex justify-center items-center flex-wrap gap-6 relative z-10">
                {[image1, image2, image3, image5, image6, image7].map((img, idx) => (
                    <div key={idx} className="transform hover:scale-105 transition-all duration-500">
                        <Card image={img} />
                    </div>
                ))}

                <div 
                    className={`w-[150px] h-[250px] bg-white/5 border border-blue-500/20 rounded-2xl overflow-hidden hover:border-blue-500 cursor-pointer flex items-center justify-center transition-all ${selectedImage === "input" ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''}`} 
                    onClick={() => {
                        inputImage.current.click();
                        setSelectedImage("input");
                    }}
                >
                    {!fontendImage && <RiImageAddLine className="text-blue-500/50 w-8 h-8" />}
                    {fontendImage && <img src={fontendImage} alt="Preview" className='h-full object-cover' />}
                </div>

                <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage} />
            </div>

            {selectedImage && (
    <button
        className="group relative px-24 py-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg transition-all hover:shadow-xl mt-12 z-10"
        onClick={() => navigate("/customize2")}
    >
        <div className="absolute inset-0 bg-blue-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span className="relative z-10 text-lg tracking-wider uppercase">Proceed to Name Sync</span>
    </button>
)}

        </div>
    );
}

export default Customize;