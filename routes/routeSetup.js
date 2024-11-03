class RouteSetup {
    defaultRoutes = {
        login: '/auth/login',
        logout: '/auth/logout',
        status: '/auth/status',
        add: '/auth/add',
        update: '/auth/update',
        delete: '/auth/delete'
    }

    constructor(app, userController, authController) {
        this.userController = userController;
        this.authController = authController;
        this.app = app;
    }

    setupRoutes(customRoutes = {}) {
        const routes = { ...this.defaultRoutes, ...customRoutes };
        const routeValues = Object.values(routes);
        const uniqueRoutes = new Set(routeValues);

        if (routeValues.length !== uniqueRoutes.size) {
            throw new Error('Custom routes must be unique and not repeat.');
        }

        this.routes = routes;
    }

    initializeRoutes() {
        this.app.post(this.routes.login, this.authController.loginUser.bind(this.authController));
        this.app.post(this.routes.logout, this.authController.logoutUser.bind(this.authController));
        this.app.get(this.routes.status, this.authController.checkStatus.bind(this.authController));
        this.app.post(this.routes.add, this.userController.addUser.bind(this.userController));
        this.app.put(this.routes.update, this.userController.updateUser.bind(this.userController));
        this.app.delete(this.routes.delete, this.userController.deleteUser.bind(this.userController));
    }
}

module.exports = RouteSetup;