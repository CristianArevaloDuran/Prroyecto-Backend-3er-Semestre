import mongoose from "mongoose";

const connection = async () => {
    try {
        await mongoose.connect("mongodb://root:example@database:27017/markdown?authSource=admin");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
};

export default connection;
