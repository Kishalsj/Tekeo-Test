import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://takeoweb:takeoweb@cluster0.79djiea.mongodb.net/food-del').then(()=>console.log("DataBase Connected"));
}