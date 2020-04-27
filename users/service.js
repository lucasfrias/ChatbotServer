const bcrypt = require('bcryptjs');
const config = require('config.json');
const db = require('utility/db');
const jwt = require('jsonwebtoken');
const User = db.User;

module.exports = {
    create,
    getById,
    getAll,
    deleteUser,
    reAuthenticate
};

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    //save user
    await user.save();

    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id }, config.secret);
    return {
        ...userWithoutHash,
        token
    };

}

  async function getById(id) {
    return await User.findById(id).select('-hash');
  }

  async function getAll() {
    return await User.find().select('-hash');
  }

  async function deleteUser(id) {
    const user = await User.findById(id);
    if (!user) throw 'User not found';
    await User.findByIdAndRemove(id);
}

  async function reAuthenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}
