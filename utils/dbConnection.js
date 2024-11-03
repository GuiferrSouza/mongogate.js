const mongoose = require('mongoose');

async function connectToDatabase(config) {
    const { connectionString, dbName } = config;

    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: dbName,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Connection Error:', err);
    }
}

async function disconnectFromDatabase() {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (err) {
        console.error('Disconnection Error:', err);
    }
}

module.exports = { connectToDatabase, disconnectFromDatabase };