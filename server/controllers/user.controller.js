import { response } from "express";
import User from "../models/user.model.js";
import moment from "moment/moment.js";
import { uploadCloudinary } from "../configs/cloudinary.js";
import geminiResponse from "../gemini.js";
import { exec } from "child_process";


export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(200).json(null);
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(200).json(null);
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        const updateData = { assistantName };
        
        if (req.file) {
            updateData.assistantImage = await uploadCloudinary(req.file.path);
        } else if (imageUrl && imageUrl !== "null" && imageUrl !== "undefined") {
            updateData.assistantImage = imageUrl;
        }

        const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true }).select("-password");
        return res.status(200).json(user);

    }
    catch (error) {
        console.error("Update Error:", error);
        return res.status(400).json({ message: "update assistant error" });
    }
}

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user = await User.findById(req.userId);
        const userName = user?.name || "User";
        const assistantName = user?.assistantName || "Assistant";
        
        const result = await geminiResponse(command, assistantName, userName);

        // Robust JSON extraction
        let gemResult;
        try {
            const start = result.indexOf("{");
            const end = result.lastIndexOf("}");
            if (start !== -1 && end !== -1) {
                let jsonStr = result.substring(start, end + 1);
                jsonStr = jsonStr.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
                gemResult = JSON.parse(jsonStr);
            } else {
                gemResult = { type: "general", userInput: command, response: result };
            }
        } catch (e) {
            gemResult = { type: "general", userInput: command, response: result };
        }

        const type = gemResult.type || "general";
        const resText = gemResult.response || result;
        const inputLower = command.toLowerCase();
        
        let execName = null;
        let appName = (gemResult.userInput || "").replace(/open /i, '').trim().toLowerCase();

        if (type === 'open-app' || inputLower.includes('open')) {
            if (appName.includes('vs code') || appName.includes('visual studio')) execName = 'code';
            else if (appName.includes('notepad')) execName = 'notepad';
            else if (appName.includes('calculator') || appName === 'calc') execName = 'calc';
            else if (appName.includes('chrome')) execName = 'chrome';
            else if (appName.includes('antigravity')) execName = 'antigravity';
            else if (appName.includes('bravo')) execName = 'bravo';
            else if (appName.includes('command prompt') || appName === 'cmd' || appName.includes('terminal')) execName = 'cmd';
            else if (appName.includes('powershell')) execName = 'powershell';
            else if (appName.includes('file explorer') || appName.includes('my computer') || appName.includes('this pc')) execName = 'explorer';
            else if (appName.includes('task manager')) execName = 'taskmgr';
            else if (appName.includes('control panel')) execName = 'control';
            else if (appName.includes('settings')) execName = 'ms-settings:';
            else if (appName.includes('paint')) execName = 'mspaint';
            else if (appName.includes('word') && !appName.includes('wordpad')) execName = 'winword';
            else if (appName.includes('excel')) execName = 'excel';
            else if (appName.includes('powerpoint')) execName = 'powerpnt';
            else if (appName.includes('edge')) execName = 'msedge';
            else if (appName.includes('spotify')) execName = 'spotify';
            else if (appName.includes('clock') || appName.includes('alarm')) execName = 'ms-clock:';
            else if (appName.includes('store')) execName = 'ms-windows-store:';
            else if (appName.includes('maps')) execName = 'bingmaps:';
        }

        if (execName) {
            console.log(`[App Launcher] Executing: "start ${execName}"`);
            exec(`start "" "${execName}"`, (error) => {
                if (error) console.error("[App Launcher] Error:", error);
            });
            return res.json({
                type: 'open-app-backend',
                userInput: gemResult.userInput || command,
                response: `Initializing ${appName}...`
            });
        }

        switch (type) {
            case 'get-date':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current date is ${moment().format("YYYY-MM-DD")}`
                });
            case 'get-time':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current time is ${moment().format("hh:mm:A")}`
                });
            case 'get-day':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today is ${moment().format("dddd")}`
                });
            case 'get-month':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current month is ${moment().format("MMMM")}`
                });

            default:
                return res.json({
                    type,
                    userInput: gemResult.userInput || command,
                    response: resText,
                });

        }
    }
    catch (error) {
        console.error("Ask Error:", error);
        return res.status(500).json({ response: "I'm sorry, I'm having trouble connecting to my brain right now." })
    }
}
