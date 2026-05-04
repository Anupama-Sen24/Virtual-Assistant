import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        }) 
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        if (error.message.includes("ESERVFAIL")) {
            console.error("DNS Error: Your computer is having trouble finding the MongoDB server. Check your internet connection or DNS settings.");
        }
    }
}

export default connectDB;