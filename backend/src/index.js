import dotenv from "dotenv"
import app from "./app.js"
import connectDB from "./config/db.js"
dotenv.config()

const PORT = process.env.BACKEND_PORT || 3000;

connectDB()
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Backend is Up and Running ${PORT}`);
    })
})
.catch(()=>{
    console.log(`MongoDB Connection Failed: ${error}`);
})
