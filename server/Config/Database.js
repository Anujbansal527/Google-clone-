import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DbConnect = () =>{
    mongoose.connect(process.env.DB_URL,{ })
    .then(()=> console.log("MongoDB Connected..."))
    .catch((error) => {console.log(`error occured while connecting db ${error.message}`)})
}

export default DbConnect;