# KOA & MongoDB

client:
```javascript
  npm run start
```

node： 
```javascript
  npm run autoStart
```

MongoDB 
```javascript
  ./mongod --dbpath=/usr/local/mongodb/data --logpath=/usr/local/mongodb/logs/mongod.log  --logappend  --port=27017
```

**install mongodb(Linux)**

- curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.2.9.tgz
- tar zxvf mongodb-linux-x86_64-3.2.9.tgz
- mv /root/mongodb-linux-x86_64-3.2.9/* /usr/local/mongodb
- mkdir -p  /usr/local/mongodb/data    mkdir -p  /usr/local/mongodb/logs    touch /usr/local/mongodb/logs/mongod.log     touch /usr/local/mongodb/mongodb.conf
- cd /usr/local/mongodb/bin
- start: ./mongod --dbpath=/usr/local/mongodb/data --logpath=/usr/local/mongodb/logs/mongod.log  --logappend  --port=27017
- Soft connection startup mongodb:  ln -s /usr/local/mongodb/bin/mongo /bin/mongo

