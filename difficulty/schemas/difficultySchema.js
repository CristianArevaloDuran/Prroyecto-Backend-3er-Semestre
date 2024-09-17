import mongoose from "mongoose";

const difficultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    }
});

export default mongoose.model('Difficulty', difficultySchema);