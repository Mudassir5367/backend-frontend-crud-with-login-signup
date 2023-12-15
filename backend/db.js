const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/main-crud-assignment';

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURL, { });
    console.log('Connected');

    // Get the collection reference
    const collection = mongoose.connection.db.collection('users');

    // Fetch data from the collection
    const data = await collection.find({}).toArray();
    // console.log(data);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

module.exports = mongoDB();
