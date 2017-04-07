//
// 抓取代理的ip地址
//

const proxy1 = require('./proxys/66_daili')
const proxy2 = require('./proxys/xici_daili')
const proxy3 = require('./proxys/you_daili')

const client = require('./redisProxyPool')
const moment = require('moment')

const request = require('superagent')
const agent_proxy = require('superagent-proxy')
agent_proxy(request)

async function retryProxy() {
    const proxy = await client.randomkeyAsync()
    console.log("retry proxy", proxy)
    return new Promise((resolve, reject) => {
        request
            .get('http://www.taobao.com/')
            .timeout({
                response: 3 * 1000,  // Wait 3 seconds for the server to start sending,
                deadline: 3 * 1000, // but allow 3 seconds for the file to finish loading.
            })
            .proxy(proxy)
            .end(function(err, res) {
                if (err || res.status != 200) {
                    console.log(err)
                    client.del(proxy)
                    resolve(false)
                }
                else {
                    console.log("get proxy: ", proxy)
                    resolve(proxy)
                }
            })
    })
}

async function getProxy() {
    let loop = true
    while(loop) {
        proxy = await retryProxy()
        if (proxy)
            loop = false
        console.log("proxy: ", proxy)
    }
    return proxy
}

async function scheduleProxy() {
    let address1 = await proxy1()
    console.log("address1", address1.length)
    let address2 = await proxy2()
    console.log("address2", address2.length)
    let address3 = await proxy3()
    console.log("address3", address3.length)

    address1.map(add => {
        const proxy = `http://${add.IP}:${add.port}`
        check(proxy, false)
    })
    address2.map(add => {
        const proxy = `http://${add.IP}:${add.port}`
        check(proxy, false)
    })
    address3.map(add => {
        const proxy = `http://${add.IP}:${add.port}`
        check(proxy, false)
    })
    return true
}

async function checkProxy() {
    const keys = await client.keysAsync('*')
    keys.map(key => {
        check(key)
    })
    return 'done'
}

function check(proxy, d=true) {
    console.log(proxy)
    request
        .get('http://www.taobao.com/')
        .timeout({
            response: 30 * 1000,  // Wait 5 seconds for the server to start sending,
            deadline: 30 * 1000, // but allow 10 seconds for the file to finish loading.
        })
        .proxy(proxy)
        .end(function(err, res) {
            if (err || res.status != 200) {
                console.log(err)
                if (d)
                    client.del(proxy)
                return
            }
            console.log(proxy)
            console.log("proxy status code: ", res.status)
            client.set(proxy, moment().unix())
    })
}

module.exports = {
    // check all proxies in pool
    checkProxy,
    // get a random proxy from pool
    getProxy,
    // get all proxies from website and check if valid then push to redis pool
    scheduleProxy
}
