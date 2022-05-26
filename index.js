const mongoose = require('mongoose')


const User = mongoose.model('User', {
    username: String,
    age: Number,
})

const create = async() => {
    const user = new User({ username: "Matías", age: 24 });
    const savedUser = await user.save()
    console.log(savedUser);
}

const getAllUsers = async() => {
    const users = await User.find();
    console.log(users);
}

const getUser = async() => {
    const user = await User.find({ username: "Matías" })
    console.log(user);
}

const findOneUser = async() => {
    const user = await User.findOne({ username: "admin" });
    console.log(user);
}

const updateUser = async() => {
    const user = await User.findOne({ username: "admin" })
    user.edad = 30;
    await user.save();
}

const deleteUser = async() => {
    const user = await User.findOne({ username: "admin" })
    if (user) {
        await user.remove();
    }
}



// findOneUser();

// getUser();

// getAllUsers();

// create();