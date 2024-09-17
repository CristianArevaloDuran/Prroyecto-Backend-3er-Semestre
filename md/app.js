import express from 'express';
import cors from 'cors';
import matter from 'gray-matter';
import multer from 'multer';
import mongoose from 'mongoose';
import fs from 'fs';
import connection from './db/connection.js';
import markdownSchema from './schemas/markdownSchema.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
connection();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ' - ' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const port = process.env.PORT || 4000;

//Get

app.get('/', (req, res) => {
    res.send('Markdown Upload Service');
});

app.get('/markdowns', async (req, res) => {
    try {
        const markdowns = await markdownSchema.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            }, {
                $unwind: '$category'
            }, {
                $lookup: {
                    from: 'difficulties',
                    localField: 'difficulty',
                    foreignField: '_id',
                    as: 'difficulty'
                }
            }, {
                $unwind: '$difficulty'
            }
        ]);
        res.send(markdowns);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/markdown/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const markdown = await markdownSchema.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
                }, {
                    $unwind: '$category'
                }, {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                }
        ]);
        
        const file = fs.readFileSync(markdown[0].path, 'utf-8');
        const { data, content } = matter(file);
        return res.json({ data, content, markdown });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to get markdown file' });
    }
});

//Post

app.post('/upload', upload.single('file'), (req, res) => {
    const { title, difficulty, category } = req.body;
    const path = req.file.path;
    const fileType = req.file.mimetype;

    if (fileType !== 'text/markdown') {
        fs.unlinkSync(path);
        return res.status(400).json({ message: 'Only markdown files are allowed' });
    }

    try {
        const markdown = new markdownSchema({ title, path, difficulty, category });
        markdown.save();
        return res.json({ message: 'Markdown file uploaded successfully' });
    } catch (error) {
        fs.unlinkSync(path);
        console.error(error);
        return res.status(500).json({ message: 'Failed to upload markdown file' });   
    }
});

//Delete

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const markdown = await markdownSchema.findById(id);
        console.log(markdown);
        
        fs.unlinkSync(markdown.path);
        await markdownSchema.findByIdAndDelete(id);
        return res.json({ message: 'Markdown file deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to delete markdown file' });
    }
});

//Put

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});