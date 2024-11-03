const { connectToDatabase, disconnectFromDatabase } = require('../utils/dbConnection');

const initializePassport = require('../utils/passportConfig');
const createUserModel = require('../models/userModel');
const createSessionModel = require('../models/sessionModel');

const AuthController = require('../controllers/authController');
const UserController = require('../controllers/userController');
const RouteSetup = require('../routes/routeSetup');

class MongoGate {
    #session = null;
    #user = null;

    constructor(app, config, connect) {
        this.#config(app, config);
        this.#initializeModels();
        this.#initializeControllers();
        this.#initializePassport();
        this.#setupRoutes(config);
        if (connect) this.connect();
    }

    #config(app, config) {
        this.config = config;
        this.app = app;
    }

    #initializeModels() {
        const userSchemaFields = { [this.config.userField]: String, [this.config.passwordField]: String };
        this.#user = createUserModel(this.config.userCollection, userSchemaFields);
        this.#session = createSessionModel(this.config.sessionCollection, this.config.sessionExpiration);
    }

    #initializeControllers() {
        this.authController = new AuthController(this.#session, this.#user, this.config.multipleSessions);
        this.userController = new UserController(this.#user, this.config.userField, this.config.passwordField, this.config.hashedPassword);
    }

    #initializePassport() {
        initializePassport(this.app, this.#user, this.config);
    }

    #setupRoutes(config) {
        const routeSetup = new RouteSetup(this.app, this.userController, this.authController);
        routeSetup.setupRoutes(config.customRoutes);
        routeSetup.initializeRoutes();
    }

    async connect() { await connectToDatabase(this.config); }

    async disconnect() { await disconnectFromDatabase(); }
}

module.exports = MongoGate;