//
// 抓取代理的ip地址
//

const proxy1 = require('./proxys/66_daili')
const proxy2 = require('./proxys/xici_daili')
const proxy3 = require('./proxys/you_daili')

const client = require('./redisProxyPool')
const moment = require('moment')
const header = require('./header')

const request = require('superagent')
const agent_proxy = require('superagent-proxy')
agent_proxy(request)

async function getProxy() {
    let loop = true
    let proxy = null

    while(loop) {
        proxy = await client.randomkeyAsync()
        const ret = await check(proxy, true)
        if (ret)
            loop = false
        console.log("proxy: ", proxy)
    }
    return proxy
}

async function scheduleProxy() {
    let address1 = await proxy1()
    console.log("address1", address1.length)
    address1.map(add => {
        const proxy = `http://${add.IP}:${add.port}`
        check(proxy, false)
    })

    let address2 = await proxy2()
    console.log("address2", address2.length)
    address2.map(add => {
        const proxy = `http://${add.IP}:${add.port}`
        check(proxy, false)
    })

    let address3 = await proxy3()
    console.log("address3", address3.length)
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

async function check(proxy, d=true, timeout=10) {
    console.log(proxy)
    return new Promise((resolve, reject) => {
        request
            .get('http://taobao.com')
            .timeout({
                response: timeout * 1000,  // Wait 10 seconds for the server to start sending,
                deadline: timeout * 1000, // but allow 10 seconds for the file to finish loading.
            })
            .set(header)
            .proxy(proxy)
            .end(function(err, res) {
                console.log("err", err)
                if (res && res.status == 200 && res.text.indexOf('kissy') != -1) {
                    client.set(proxy, moment().unix())
                    resolve(proxy)
                }
                else {
                    if (d)
                        client.del(proxy)
                    resolve(false)
                }
        })
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
