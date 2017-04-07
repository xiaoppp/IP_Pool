const request = require('superagent');
const cheerio = require('cheerio')
const Address = require('./Address')

// 抓取代理66 http://www.66ip.cn/
async function proxy(proxy_number=100) {
    const url = `http://m.66ip.cn/mo.php?sxb=&tqsl={}&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=${proxy_number}`
    const html = await request.get(url)

    const matchs = html.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/g)
    const addresses = matchs.map(m => {
        const [address, port] = m.split(':')
        return new Address(address, port)
    })
    return addresses
}

module.exports = proxy

if (require.main === module) {
    proxy()
        .then(address => console.log(address))
        .catch(err => console.log(err))
}
