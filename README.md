# mongogate.js

This library provides an easy solution for user authentication in MongoDB using `mongoose`, `passport`, and `bcryptjs`. It allows flexible configuration of email and password fields, as well as support for hashed passwords.

## Features

- **User Authentication**: Login and logout using `passport` and local strategy.
- **Session Management**: Store and manage sessions in MongoDB.
- **Flexible Configuration**: Customize email and password fields, and define whether the password should be hashed.

## Installation

Clone the repository or download the required dependencies with:
```bash
npm install mongogate
```

## Usage

### Basic Configuration
Usage example with Express:
```js
const MongoGate = require('mongogate');
const express = require('express');

const app = express();

app.use(express.json());

const config = {
    userField: 'Email',
    passwordField: 'Password',
    connectionString: 'mongodb+srv://your-username:password@cluster.mongodb.net/Users?retryWrites=true&w=majority',
    dbName: 'UsersDatabase',
    userCollection: 'UsersCollection',
    sessionCollection: 'SessionsCollection',
    hashedPassword: true,
    multipleSessions: true,
    sessionExpiration: 3600000, // 1 hour
    customRoutes: {
        login: '/auth/custom-login',
        logout: '/auth/custom-logout'
    }
};

new MongoGate(app, config, true);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

## Configuration options
- `userField`: The field to be used as the user (example: 'Email').
- `passwordField`: The field to be used as the password (example: 'Password').
- `connectionString`: Your MongoDB connection string.
- `dbName`: The name of the database.
- `userCollection`: The name of the user collection.
- `sessionCollection`: The name of the session collection.
- `hashedPassword`: Set to true to hash the password using bcryptjs.
- `multipleSessions`: Allows multiple active sessions for the same user.
- `sessionExpiration`: Sets the duration after which a user session will automatically expire if inactive.
- `customRoutes`: Customize the login and logout routes.

## Default routes
The library provides the following authentication routes:

- `POST` `/auth/login` – Logs in a user.
- `POST` `/auth/logout` – Logs out a user.
- `GET` `/auth/status` – Checks the authentication status.
- `POST` `/auth/add` – Adds a new user.
- `PUT` `/auth/update` – Updates user data.
- `DELETE` `/auth/delete` – Deletes a user.

## License
This project is licensed under the MIT License.