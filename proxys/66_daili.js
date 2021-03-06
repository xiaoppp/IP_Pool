const request = require('superagent');
const cheerio = require('cheerio')
const Address = require('./Address')

// 抓取代理66 http://www.66ip.cn/
async function proxy(pages=50) {
    let list = []
    for (let i = 0; i < pages; i++) {
        const url = `http://m.66ip.cn/mo.php?sxb=&tqsl={}&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=${i}`
        const data = await request.get(url)
        const html = data.text
        const matchs = html.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/g)
        if (matchs) {
            matchs.map(m => {
                const [address, port] = m.split(':')
                console.log(address, port)
                list.push(new Address(address, port))
            })
        }
    }
    return list
}

module.exports = proxy

if (require.main === module) {
    proxy()
        .then(address => console.log(address))
        .catch(err => console.log(err))
}
