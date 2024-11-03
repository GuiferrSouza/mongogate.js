const mongoose = require('mongoose');

const createUserModel = (userCollection, userSchemaFields) => {
    const userSchema = new mongoose.Schema(
        userSchemaFields,
        {
            collection: userCollection,
            strict: false,
            versionKey: false
        }
    );

    return mongoose.model('User', userSchema);
};

module.exports = createUserModel;