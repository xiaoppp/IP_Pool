// 抓取有代理 http://www.youdaili.net/Daili/http/

const request = require('superagent');
const cheerio = require('cheerio')
const Address = require('./Address')
const addresses = []

async function get_urls() {
    const html = await request.get("http://www.youdaili.net/Daili/http/")
    const parser = cheerio.load(html)
    let list = []
    parser(".chunlist ul li p a")
        .each((index, ele) => {
            const href = parser(ele).attr('href')
            list.push(href)
        })
    return list
}

async function get_proxy_url(url) {
    const html = await request.get(url)
    const matchs = html.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/g)

    matchs.map(m => {
        const [address, port] = m.split(':')
        console.log(address, port)
        addresses.push(new Address(address, port))
    })
}

async function proxy() {
    const urls = await get_urls()

    for (let url of urls) {
        await get_proxy_url(url)
    }
    return addresses
}

module.exports = proxy
if (require.main === module) {
    proxy()
        .then(address => console.log(address))
        .catch(err => console.log(err))
}
