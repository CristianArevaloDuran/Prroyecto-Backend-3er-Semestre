import express from 'express';
import mongoose from 'mongoose';
import connection from './db/connection.js';
import cors from 'cors';
import difficultySchema from './schemas/difficultySchema.js';


const app = express();
app.use(express.json());
app.use(cors());
connection();

const port = process.env.PORT || 4002;

// Get

app.get('/', (req, res) => {
    res.send('Difficulty service');
});

app.get('/difficulties', async (req, res) => {
    try {
        const difficulty = await difficultySchema.find();
        res.send(difficulty);
    } catch (error) {
        res.status(500).send(error);
    }
});


//Post

app.post('/difficulty', async (req, res) => {
    const { name, color } = req.body;
    
    try {
        const difficulty = new difficultySchema({ name, color });
        await difficulty.save();
        res.status(201).send(difficulty);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Delete


//Put

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
