const charset = require('superagent-charset')
const request = require('superagent')
const agent_proxy = require('superagent-proxy')
charset(request)
agent_proxy(request)
const proxyManager = require('../proxy')

async function download(url, charset="utf8") {
    let proxy = await proxyManager.getProxy()
    console.log("get proxy", proxy)
    return new Promise(function(resolve, reject, notify) {
        request
            .get(url)
            .redirects(100)
            .charset(charset) // here to support charset
            .proxy(proxy)
            .timeout({
                response: 5 * 1000,  // Wait 5 seconds for the server to start sending,
                deadline: 5 * 1000, // but allow 10 seconds for the file to finish loading.
            })
            .end(function(err, res) {
                if (err) {
                    return reject("出现错误，请重试!")
                }

                if (res.status != 200 && res.status != 301 && res.status != 302)
                    return reject("返回码不对!")

                console.log("status code: ", res.status)
                let data = res.text
                resolve(data)
        })
    })
}


if (require.main === module) {
    const url = "http://item.taobao.com/item.htm?id=525715994121"
    download(url)
        .then(data => console.log(data))
}
