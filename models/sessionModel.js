const mongoose = require('mongoose');

const createSessionModel = (sessionCollection, sessionExpiration) => {
    const sessionSchema = new mongoose.Schema(
        {
            sessionId: String, userId: String,
            createdAt: { type: Date, default: Date.now },
            expiresAt: { type: Date, default: sessionExpiration ? () => Date.now() + sessionExpiration : null }
        },
        {
            collection: sessionCollection,
            versionKey: false
        }
    );

    if (sessionExpiration) sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    return mongoose.model('Session', sessionSchema);
};

module.exports = createSessionModel;
