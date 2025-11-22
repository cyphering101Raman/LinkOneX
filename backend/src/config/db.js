import mongoose from "mongoose"
const connectDB = async () => {
    try {
        const instanceDB = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected.`);
        console.log(`DB HOST: ${instanceDB.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Connection Failed: ${error}`);
    }
}

export default connectDB;