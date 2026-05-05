import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Home from "./pages/Home.jsx";
import Customize from "./pages/Customize.jsx";
import Customize2 from "./pages/Customize2.jsx";
import { userDataContext } from "./context/UserContext.jsx";

function App() {
  const { userData, loading } = useContext(userDataContext);

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#050505] flex flex-col justify-center items-center font-mono">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-[80px] animate-pulse" />
          <div className="w-[120px] h-[120px] rounded-full border border-blue-500/20 flex justify-center items-center relative z-10 p-2">
            <div className="w-full h-full rounded-full border border-blue-500/40 p-2 animate-[spin_3s_linear_infinite]">
              <div className="w-full h-full rounded-full border-t-2 border-blue-400" />
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h1 className="text-blue-500 text-xl font-thin tracking-[0.5em] uppercase animate-pulse">Initializing System</h1>
          <p className="text-blue-400/40 text-[8px] tracking-[0.4em] uppercase mt-2">Loading Neural Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root path logic */}
      <Route path="/" element={
        !userData 
          ? <Navigate to="/signin" replace /> 
          : (userData.assistantImage && userData.assistantName 
              ? <Home /> 
              : <Navigate to="/customize" replace />)
      } />

      {/* Auth paths */}
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" replace />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" replace />} />

      {/* Protected paths */}
      <Route path="/customize" element={userData ? <Customize /> : <Navigate to="/signup" replace />} />
      <Route path="/customize2" element={userData ? <Customize2 /> : <Navigate to="/signup" replace />} />
    </Routes>
  );
}

export default App; 