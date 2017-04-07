const bluebird = require("bluebird")
const redis = require("redis")
const moment = require("moment")
const config = require("./config")

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const options = {
    host: config.redis,
    port: 6379,
    password: config.redis_pwd,
    socket_keepalive: true,
    no_ready_check: true
}

const client = redis.createClient(options)

client.select(7, function() {
    console.log('redis client select 7 IP Proxy pool OK')
})

client.on('ready', () => {
    console.log('client ready')
})

client.on('connect', () => {
    console.log('ip client connect ', config.redis)
})

client.on("error", function (err) {
    console.log("error " + err)
})

module.exports = client
