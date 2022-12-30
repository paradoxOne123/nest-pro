let Db = require('./db').Db;
let mongodb = new Db();

function User (user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
}

module.exports = User;

//save userinfo
User.prototype.save = async function (query) {
  let user = {
    name: this.name,
    password: this.password,
    email: this.email
  };

  const result = await mongodb.insert(user, 'users')
  return result
}

//read userinfo
User.prototype.get = async function (name) {
  const result = await mongodb.find({ name: name }, 'users')
  return result
};