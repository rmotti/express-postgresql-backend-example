import mongoose from 'mongoose';

const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB_NAME,
    });
    console.log('Connected to MongoDB');
  } 
  catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
}

export default {connect};