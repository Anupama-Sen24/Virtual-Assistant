import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.model("User", new mongoose.Schema({ email: String }));
        const count = await User.countDocuments();
        console.log("Total users in database:", count);
        const users = await User.find({}, { email: 1 });
        console.log("Emails in database:", users.map(u => u.email));
        await mongoose.connection.close();
    } catch (error) {
        console.error("Error checking users:", error);
    }
}

checkUsers();
