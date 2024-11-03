const bcrypt = require('bcrypt');

class UserController {
    constructor(userModel, userField, passwordField, hashedPassword) {
        this.userModel = userModel;
        this.userField = userField;
        this.passwordField = passwordField;
        this.hashedPassword = hashedPassword;
    }

    async addUser(req, res) {
        try {
            const { [this.userField]: User, [this.passwordField]: Password, ...rest } = req.body;
            if (!User || !Password) return res.status(400).send({ message: 'User and password are required' });

            const existingUser = await this.userModel.findOne({ [this.userField]: User });
            if (existingUser) return res.status(400).send({ message: 'User already exists' });

            const hashedPassword = this.hashedPassword ? await bcrypt.hash(Password, 10) : Password;
            const newUser = new this.userModel({ [this.userField]: User, [this.passwordField]: hashedPassword, ...rest });
            await newUser.save();

            res.send({ message: 'User added successfully', user: newUser });
        } catch (err) {
            res.status(500).send({ message: 'Error adding user', err });
        }
    }

    async updateUser(req, res) {
        try {
            const { [this.userField]: User, ...updateData } = req.body;
            if (!User) return res.status(400).send({ message: 'User is required' });

            const existingUser = await this.userModel.findOne({ [this.userField]: User });
            if (!existingUser) return res.status(404).send({ message: 'User not found' });

            if (updateData[this.passwordField]) {
                updateData[this.passwordField] = this.hashedPassword ?
                    await bcrypt.hash(updateData[this.passwordField], 10) :
                    updateData[this.passwordField];
            }

            const updatedUser = await this.userModel.findOneAndUpdate({ [this.userField]: User }, updateData, { new: true });
            res.send({ message: 'User updated successfully', user: updatedUser });
        } catch (err) {
            res.status(500).send({ message: 'Error updating user', err });
        }
    }

    async deleteUser(req, res) {
        try {
            const { [this.userField]: User } = req.body;
            if (!User) return res.status(400).send({ message: 'User is required' });

            const deletedUser = await this.userModel.findOneAndDelete({ [this.userField]: User });
            if (!deletedUser) return res.status(404).send({ message: 'User not found' });

            res.send({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).send({ message: 'Error deleting user', err });
        }
    }
}

module.exports = UserController;