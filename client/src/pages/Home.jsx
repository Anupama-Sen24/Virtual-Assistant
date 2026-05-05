import React, { useContext, useEffect, useRef, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

import aiImg from '../assets/ai.gif';
import userImg from '../assets/user.gif';

function Home() {
    const { serverUrl, userData, setUserData } = useContext(userDataContext);
    const [userText, setUserText] = useState("");
    const [aiText, setAiText] = useState("");
    const [isStarted, setIsStarted] = useState(false);
    const [pendingUrl, setPendingUrl] = useState(null);
    const navigate = useNavigate();
    const recognitionRef = useRef(null)


    function speak(text, lang = 'en-US') {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        
        const voices = window.speechSynthesis.getVoices();
        // Try to find a voice matching the specific language
        let voice = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase());
        
        // Fallback: match by language family (e.g., 'hi' for 'hi-IN')
        if (!voice) voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
        
        // Final fallback: use a male English voice if nothing else found
        if (!voice) voice = voices.find(v => v.name.includes("Male") && v.lang.includes("en"));
        
        if (voice) utter.voice = voice;
        utter.rate = 1.0;
        utter.pitch = 1.0;

        utter.onstart = () => {
            isSpeakingRef.current = true;
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) {}
            }
        };

        utter.onend = () => {
            isSpeakingRef.current = false;
            if (isStartedRef.current && recognitionRef.current) {
                setTimeout(() => {
                    try { recognitionRef.current.start(); } catch (e) {}
                }, 300);
            }
        };

        utter.onerror = () => {
            isSpeakingRef.current = false;
        };

        window.speechSynthesis.speak(utter);
    }


    async function getGeminiResponse(prompt) {
        try {
            const res = await axios.post(`${serverUrl}/api/user/ask`, { command: prompt }, { withCredentials: true });
            return res.data;
        } catch (err) {
            console.error('Gemini Error:', err);
            return null;
        }
    }


    function handleCommands(data) {
        const { type, response, userInput, lang } = data;
        speak(response, lang || 'en-US');
        setAiText(response);
        let url = "";
        let deepLink = "";

        const input = userInput.toLowerCase();


        if (type === 'open-app' || input.includes('open') || type === 'open-app-backend') {
            if (input.includes('vs code') || input.includes('visual studio')) deepLink = 'vscode://';
            else if (input.includes('spotify')) deepLink = 'spotify://';
            else if (input.includes('zoom')) deepLink = 'zoommtg://';
            else if (input.includes('slack')) deepLink = 'slack://';
            else if (input.includes('discord')) deepLink = 'discord://';
            else if (input.includes('whatsapp')) deepLink = 'whatsapp://';
            else if (input.includes('telegram')) deepLink = 'tg://';
            else if (input.includes('steam')) deepLink = 'steam://';
            else if (input.includes('skype')) deepLink = 'skype:';
            else if (input.includes('mail') || input.includes('email')) deepLink = 'mailto:';
        }


        if (type.includes('google') || type === 'general-search' || (input.includes('search') && !input.includes('youtube'))) {
            url = `https://www.google.com/search?q=${encodeURIComponent(userInput)}`;
        } else if (type.includes('youtube') || input.includes('youtube')) {
            url = `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`;
        } else if (type.includes('instagram') || input.includes('instagram')) {
            url = 'https://www.instagram.com';
        } else if (type.includes('facebook') || input.includes('facebook')) {
            url = 'https://www.facebook.com';
        } else if (type.includes('whatsapp') || input.includes('whatsapp')) {
            url = 'https://web.whatsapp.com';
        } else if (type.includes('twitter') || input.includes('twitter')) {
            url = 'https://twitter.com';
        } else if ((type.includes('github') || input.includes('github')) && !deepLink) {
            url = 'https://github.com';
        } else if ((type.includes('spotify') || input.includes('spotify')) && !deepLink) {
            url = 'https://open.spotify.com';
        } else if (type.includes('netflix') || input.includes('netflix')) {
            url = 'https://www.netflix.com';
        }

        // 3. Fallback: If it's a URL or a generic 'open' command that wasn't caught
        const isUrl = userInput.includes('.') && !userInput.includes(' ') && userInput.length > 3;
        if (isUrl && !url && !deepLink) {
            url = userInput.startsWith('http') ? userInput : `https://${userInput}`;
        } else if ((type === 'open-app' || input.includes('open')) && !url && !deepLink && type !== 'open-app-backend') {
            // If we still don't have a target, search for the app on Google
            url = `https://www.google.com/search?q=${encodeURIComponent(userInput)}`;
        }


        if (deepLink || url) {
            // Ask user to click to bypass pop-up blockers and gesture requirements
            setPendingUrl(deepLink || url);
        }
    }

    const isStartedRef = useRef(false);
    const isSpeakingRef = useRef(false);

    useEffect(() => {
        isStartedRef.current = isStarted;
    }, [isStarted]);


    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        // Use browser default language or fallback to en-US
        recognition.lang = navigator.language || 'en-US';
        recognitionRef.current = recognition;

        recognition.onresult = async (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            setUserText(transcript);
            setAiText('...');
            const data = await getGeminiResponse(transcript);
            if (data) handleCommands(data);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            if (isStartedRef.current && !isSpeakingRef.current) {
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (e) {
                        console.error("Speech start error", e);
                    }
                }, 300);
            }
        };
    }, []);

    const startAssistant = () => {
        setIsStarted(true);
        if (recognitionRef.current) {
            try { recognitionRef.current.start(); } catch(e) {}
        }
        speak(`System initialized. Welcome back, ${userData?.name || 'User'}. How can I help you?`);
        setAiText('System Online...');
    };

    return (
        <div className="w-full h-[100vh] bg-[#050505] flex justify-center items-center flex-col gap-[15px] overflow-hidden relative font-mono selection:bg-blue-500/30">
            {/* HUD Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* Startup Screen */}
            {!isStarted && (
                <div className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-center items-center gap-12">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-[80px] animate-pulse" />
                        <div className="w-[220px] h-[220px] rounded-full border-[1px] border-blue-500/20 flex justify-center items-center relative z-10 p-4 bg-gradient-to-b from-blue-500/5 to-transparent">
                            <div className="w-full h-full rounded-full border border-blue-500/40 p-2 animate-[spin_10s_linear_infinite]">
                                <div className="w-full h-full rounded-full border-t-2 border-blue-400" />
                            </div>
                            <img src={userData?.assistantImage} className="absolute w-[160px] h-[160px] rounded-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-1000" alt="assistant" />
                        </div>
                    </div>
                    <div className="text-center space-y-3">
                        <h1 className="text-blue-500 text-5xl font-thin tracking-[0.3em] uppercase">System <span className="font-black text-white">Standby</span></h1>
                        <p className="text-blue-400/40 text-[10px] tracking-[0.6em] uppercase">Biometric Authentication Required</p>
                    </div>
                    <button onClick={startAssistant} className="group relative px-16 py-5 bg-transparent border border-blue-500/30 text-white overflow-hidden transition-all hover:border-blue-400">
                        <div className="absolute inset-0 bg-blue-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 text-sm tracking-[0.4em] uppercase font-light">Initialize Core Engine</span>
                    </button>
                </div>
            )}

            {/* Top Navigation */}
            <div className="absolute top-[40px] left-[40px] flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-bold">Core Status: {isStarted ? 'Active' : 'Standby'}</p>
            </div>
            <div className="absolute top-[40px] right-[40px] hidden lg:flex flex-col items-end gap-3 z-50">
                <button className="px-6 py-2 border border-blue-500/30 bg-blue-500/5 text-blue-400 hover:text-white hover:bg-blue-500/20 text-[12px] tracking-[0.4em] uppercase transition-all rounded-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.1)]" onClick={() => navigate('/customize')}>[ SELECT AGENT ]</button>
                <button className="px-6 py-2 border border-red-500/30 bg-red-500/5 text-red-400/80 hover:text-white hover:bg-red-500/20 text-[12px] tracking-[0.4em] uppercase transition-all rounded-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.1)]" onClick={() => { axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true }); setUserData(null); navigate('/signin'); }}>[ LOG OUT ]</button>
            </div>

            {/* Central Assistant Display */}
            <div className="relative group mt-[-50px]">
                <div className="absolute -inset-10 border border-blue-500/5 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute -inset-20 border border-blue-500/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[40px] blur opacity-10 group-hover:opacity-30 transition duration-1000" />
                    <div className="w-[300px] h-[380px] rounded-[40px] overflow-hidden bg-black border border-blue-500/20 relative shadow-2xl">
                        <img src={userData?.assistantImage} alt="assistant" className="h-full w-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-1000 scale-110 group-hover:scale-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-0 w-full text-center px-4">
                            <h2 className="text-blue-500 text-[8px] tracking-[0.8em] uppercase opacity-40 mb-2">Neural Interface</h2>
                            <h1 className="text-white text-xl font-thin tracking-[0.5em] uppercase">{userData?.assistantName}</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visualizer Area */}
            <div className="h-[120px] flex items-center justify-center relative mt-4">
                <div className={`absolute w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] transition-all duration-1000 ${aiText ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`} />
                {aiText ? (
                    <img src={aiImg} className="w-[140px] filter hue-rotate-180 brightness-125 contrast-125 mix-blend-screen" alt="AI" />
                ) : (
                    <div className="flex gap-1 items-end h-8">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-1 bg-blue-500/30 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                )}
            </div>

            {/* Action Required HUD */}
            {pendingUrl && (
                <div className="absolute top-[200px] z-[200] flex flex-col items-center gap-4 bg-blue-900/20 p-6 rounded-lg border border-blue-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <div className="absolute inset-0 bg-blue-500/10 blur-xl animate-pulse rounded-lg pointer-events-none"></div>
                    <p className="text-blue-300 text-[10px] tracking-[0.3em] uppercase relative z-10">Target Acquired</p>
                    <button
                        onClick={() => { window.open(pendingUrl, '_blank'); setPendingUrl(null); }}
                        className="relative z-10 px-8 py-3 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400 text-white text-sm tracking-[0.4em] uppercase transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    >
                        [ LAUNCH WEBSITE ]
                    </button>
                    <button onClick={() => setPendingUrl(null)} className="relative z-10 text-red-400/60 hover:text-red-400 text-[10px] tracking-[0.2em] uppercase mt-2 transition-colors">
                        Cancel Protocol
                    </button>
                </div>
            )}

            {/* Transcript & Response */}
            <div className="flex flex-col items-center gap-6 mt-2 max-w-[80%]">
                <h1 className="text-white/30 text-center text-[13px] font-light tracking-[0.2em] italic leading-[2] min-h-[50px] transition-all duration-500">
                    {userText || aiText || 'SYSTEM_LISTENING_FOR_INPUT...'}
                </h1>
            </div>

            {/* Footer */}
            <div className="absolute bottom-12 right-12 text-right opacity-10 hidden lg:block pointer-events-none">
                <p className="text-blue-500 text-[10px] tracking-[0.4em] uppercase">VIRTUAL_CORE_4.1</p>
                <div className="flex justify-end gap-4 mt-2">
                    <p className="text-blue-500 text-[7px] tracking-[0.2em]">CPU_LOAD: 12%</p>
                    <p className="text-blue-500 text-[7px] tracking-[0.2em]">MEM_SYNC: STABLE</p>
                </div>
            </div>
        </div>
    );
}

export default Home;