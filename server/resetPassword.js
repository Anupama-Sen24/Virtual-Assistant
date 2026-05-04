import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.model("User", new mongoose.Schema({ 
            email: String,
            password: String
        }));
        
        const email = "sen425868@gmail.com";
        const newPassword = "password123";
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const result = await User.findOneAndUpdate(
            { email }, 
            { password: hashedPassword },
            { new: true }
        );
        
        if (result) {
            console.log(`Password reset for ${email} to "${newPassword}"`);
        } else {
            console.log(`User ${email} not found`);
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error("Error resetting password:", error);
    }
}

resetPassword();
