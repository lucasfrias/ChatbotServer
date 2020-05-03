const bcrypt = require('bcryptjs');
const config = require('config.json');
const db = require('utility/db');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = db.User;

module.exports = {
    create,
    getById,
    getAll,
    deleteUser,
    reAuthenticate,
    update
};

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    //session ID
    var sessionId = uuidv4();
    user.sessionId = sessionId.toString();
    console.log("creating session Id through create: " + sessionId.toString());

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
    if (!user || !bcrypt.compareSync(password, user.hash)){
      throw 'Username or password is incorrect';
    }

    var sessionId = uuidv4();
    user.sessionId = sessionId;
    console.log("updating session Id for exisiting user, " + username + " : " + sessionId.toString())
    await user.save();

    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id }, config.secret);
    return {
            ...userWithoutHash,
            token
    };
}

async function update(username) {
  const user = await User.findOne({ username: username });

  // validate
  if (!user) throw 'User not found';

  if(user.sessionId == null || user.sessionId == ''){
    var sessionId = uuidv4();
    var myquery = { username: username };
    var newvalues = { $set: {sessionId: sessionId.toString()} };
    User.updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
    console.log("creating session Id through update for " + username + " : " + sessionId.toString())
    user.sessionId = sessionId;
  }

  return user;
}
