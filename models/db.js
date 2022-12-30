var MongoClient = require('mongodb').MongoClient;
var settings = require('../settings');
let ObjectId = require('mongodb').ObjectID;

function Db () {
  this.url = settings.url;
}

const factory = {
  create: function () {
    var dbclient = MongoClient.connect(settings.url)
    return dbclient
  },
  destroy: function (client) {
    client.disconnect();
  }
};

const opts = {
  max: 100, // maximum size of the pool
  min: 2, // minimum size of the pool
  log: true
};

var genericPool = require('generic-pool');
var pool = genericPool.createPool(factory, opts)


Db.prototype.open = function (cb) {
  MongoClient.connect(this.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    cb(null, db);
  });
}
Db.prototype.close = function (db) {
  db.close();
}
Db.prototype.insert = async function (data, col) {
  return new Promise((resolve, reject) => {
    pool.acquire().then(function (db) {
      const collection = db.collection(col);
      //insert data
      collection.insert(data, function (err, result) {
        if (err) {
          reject(err)
        }
        pool.release(db);
        resolve({ err: null })
      });
    });
  })
}

Db.prototype.find = async function (data, col) {
  return new Promise((resolve, reject) => {

    pool.acquire().then(function (db) {
      console.log("pool.size: " + pool.size)// returns number of resources in the pool
      console.log("pool.available: " + pool.available)// returns number of unused resources in the pool
      console.log("pool.borrowed: " + pool.borrowed)// number of resources that are currently acquired by userland code
      console.log("pool.pending: " + pool.pending)// returns number of callers waiting to acquire a resource

      //connect to tables
      const collection = db.collection(col);

      let whereStr = data;
      collection.find(whereStr).sort({
        time: -1
      }).toArray(function (err, arr) {
        if (err) {
          reject(err)
        }
        pool.release(db);
        resolve({ err: null, list: arr })
      });
    }).catch(function (err) {
      console.log(err)
      reject(err)
    });
  })
}

module.exports = { 'Db': Db, 'Pool': pool };
