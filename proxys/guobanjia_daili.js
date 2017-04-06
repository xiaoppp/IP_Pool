// 暂时不好用，需要重新解析
// 抓取guobanjia http://www.goubanjia.com/free/gngn/index.shtml

// const request = require('request-promise-native');
// const request = require('request')
const request = require('superagent')
const cheerio = require('cheerio')
const Address = require('./address')

let options = {
    followRedirect: true,
    followAllRedirects: true,
    headers: {
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Cookie': 'auth=6eb1c158f5b78d03aa61d39740881f94'
    }
};
async function proxy() {
    const addresses = []

    let url = `http://www.goubanjia.com/free/gngn/index1.shtml`
    const html = await request.get(url).redirects(100).set(options.headers)
    console.log(html)

    // for (let page = 1; page < 10; page++) {
    //     const url = `http://www.goubanjia.com/free/gngn/index${page}.shtml`
    //     console.log(url)
    //     const html = await request.get(url, {followRedirect: true})
    //     const parser = cheerio.load(html)
    //
    //     parser('td.ip')
    //         .each((index, ele) => {
    //             const address = parser(ele).text()
    //             console.log(address)
    //         })
    // }

    return addresses
}


module.exports = proxy

if (require.main === module) {
    proxy()
        .then(address => console.log(address))
        .catch(err => console.log(err))
}
