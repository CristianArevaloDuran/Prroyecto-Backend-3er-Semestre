import express from 'express';
import mongoose from 'mongoose';
import connection from './db/connection.js';
import cors from 'cors';
import categorySchema from './schemas/categorySchema.js';


const app = express();
app.use(express.json());
app.use(cors());
connection();

const port = process.env.PORT || 5000;

// Get

app.get('/', (req, res) => {
    res.send('Category service');
});

app.get('/categories', async (req, res) => {
    try {
        const categories = await categorySchema.aggregate([
            {
                $lookup: {
                    from: 'markdowns',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'markdowns'
                }
            }, {
                $project: {
                    name: 1,
                    entradas: { $size: '$markdowns' }
                }
            }
        ]);

        res.send(categories);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Post

app.post('/category', async (req, res) => {
    const { name } = req.body;
    
    try {
        const category = new categorySchema({ name });
        await category.save();
        res.status(201).send(category);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Delete


//Put

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
