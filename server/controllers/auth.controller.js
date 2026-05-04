import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import getToken from "../configs/token.js";

export const signup = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        email = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = await getToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        });

        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: `signup error: ${error}` });
    }
};

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        email = email.toLowerCase().trim();
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Email does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = await getToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `login error: ${error}` });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: `logout error ${error}` });
    }
};
    
