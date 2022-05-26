const Users = require('./user.model')



const UserController = {
    get: async(req, res) => {
        const { id } = req.params;
        const user = await Users.findOne({ _id: id });
        res.status(200).send(user)
    },
    list: async(req, res) => {
        const foundUsers = await Users.find();
        res.status(200).send(foundUsers)
    },

    create: async(req, res) => {
        const user = new Users(req.body);
        const savedUser = await user.save();
        res.status(201).send(savedUser._id)
    },
    update: async(req, res) => {
        const { id } = req.params;
        const targetUser = await Users.findOne({ _id: id })
        Object.assign(targetUser, req.body);
        await targetUser.save();
        res.sendStatus(204).s
    },
    destroy: async(req, res) => {
        const { id } = req.params;
        const targetUser = await Users.findOne({ _id: id })
        if (targetUser) {
            targetUser.remove();
        }
        res.sendStatus(204);
    }
}

module.exports = UserController;