const charset = require('superagent-charset')
const request = require('superagent')
const agent_proxy = require('superagent-proxy')
charset(request)
agent_proxy(request)
const proxyManager = require('./proxy')

// https://github.com/TooTallNate/superagent-proxy

module.exports = async function download(url, charset="utf8") {
    let proxy = await proxyManager.getProxy()

    return new Promise(function(resolve, reject, notify) {
        request
            .get(url)
            .redirects(100)
            .charset(charset) // here to support charset
            // .proxy(proxy)
            .timeout({
                response: 5 * 1000,  // Wait 5 seconds for the server to start sending,
                deadline: 5 * 1000, // but allow 10 seconds for the file to finish loading.
            })
            .end(function(err, res) {
                if (err || !res.text) {
                    return reject("出现错误，请重试！")
                }

                if (res.status != 200 && res.status != 301 && res.status != 302)
                    return reject("出现错误，请重试！")

                console.log("status code: ", res.status)
                let data = res.text
                resolve(data)
        })
    })
}

//
// const request = require('request')
// const proxyManager = require('../../IP_pool_proxy')
//
// module.exports = async function download(url) {
//     const proxy = await proxyManager.getProxy()
//     console.log(proxy)
//     return new Promise((resolve, reject) => {
//         let options = {
//             url: url,
//             timeout: 60000,
//             proxy: proxy
//         }
//         request.get(options, (err, res, body) => {
//             if (err) {
//                 reject(err)
//             }
//             else {
//                 console.log(body)
//                 resolve(body)
//             }
//
//         })
//     })
// }
