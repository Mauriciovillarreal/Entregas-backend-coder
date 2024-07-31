const { usersModel } = require('../../models/users.model.js');

class UsersDaoMongo {
    constructor() {
        this.model = usersModel;
    }

    async getAll() {
        return await this.model.find();
    }

    async get(uid) {
        return await this.model.findById(uid);
    }

    async getUsersBy(query) {
        return await this.model.findOne(query);
    }

    async create(newUser) {
        return await this.model.create(newUser);
    }

    async update(uid, updateUser) {
        return await this.model.findByIdAndUpdate(uid, updateUser, { new: true });
    }
}

module.exports = UsersDaoMongo;
