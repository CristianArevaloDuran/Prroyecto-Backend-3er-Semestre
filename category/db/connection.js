import mongoose from 'mongoose';

const connection = async () => {
    try {
        await mongoose.connect('mongodb://root:example@database:27017/markdown?authSource=admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log('Connected to the database');
    } catch (error) {
        console.log('Error connecting to the database');
    }
};

export default connection;