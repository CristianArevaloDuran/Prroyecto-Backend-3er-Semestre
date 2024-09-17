import mongoose from "mongoose";

const markdownSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    difficulty: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Markdown', markdownSchema);