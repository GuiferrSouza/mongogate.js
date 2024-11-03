const passport = require('passport');

class AuthController {
    constructor(sessionModel, userModel, multipleSessions) {
        this.sessionModel = sessionModel;
        this.userModel = userModel;
        this.multipleSessions = multipleSessions;
    }

    async loginUser(req, res, next) {
        passport.authenticate('local', async (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).send({ message: 'Authentication failed', info });

            req.logIn(user, async (err) => {
                if (err) return next(err);

                if (!this.multipleSessions) await this.sessionModel.deleteOne({ userId: user._id });

                const newSession = new this.sessionModel({ sessionId: req.sessionID, userId: user._id });
                await newSession.save();

                req.session.userId = user._id;
                res.send({ message: 'Login successful' });
            });
        })(req, res, next);
    }

    async logoutUser(req, res) {
        const { userId, id: sessionId } = req.session;
        if (!userId) return res.status(400).send({ message: 'No active session' });

        await this.sessionModel.deleteOne({ sessionId });

        req.session.destroy((err) => {
            if (err) return res.status(500).send({ message: 'Logout failed', err });
            res.send({ message: 'Logout successful' });
        });
    }

    async checkStatus(req, res) {
        try {
            if (!req.isAuthenticated()) return res.send({ loggedIn: false, message: 'User is not authenticated' });
            
            const session = await this.sessionModel.findOne({ sessionId: req.sessionID });
            if (!session) return res.send({ loggedIn: false, message: 'User is not logged in' });

            const user = await this.userModel.findById(req.session.userId);
            res.send({ loggedIn: true, message: 'User is logged in', user });
        } catch (err) {
            res.status(500).send({ message: 'Error checking status', err });
        }
    }
}

module.exports = AuthController;