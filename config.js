const configuration = {
    "test": {
        "redis": "192.168.1.179",
        "redis_pwd": ""
    }
}

const env = "test"
const config = configuration[env]

module.exports = config
