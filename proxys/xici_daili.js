// 抓取西刺代理 http://api.xicidaili.com/free2016.txt

const request = require('superagent');
const cheerio = require('cheerio')
const Address = require('./Address')

async function proxy() {
    const urls = [
                'http://www.xicidaili.com/nn',  // 高匿
                'http://www.xicidaili.com/nt',  // 透明
            ]

    const addresses = []
    for (let url of urls) {
        const html = await request.get(url)
        const parser = cheerio.load(html)

        parser('#ip_list tr')
            .each((index, ele) => {
                const children = parser(ele).children()
                if (children) {
                    const address = parser(children[1]).text()
                    const port = parser(children[2]).text()
                    addresses.push(new Address(address, port))
                }
            })
    }
    return addresses
}


module.exports = proxy

if (require.main === module) {
    proxy()
        .then(address => console.log(address))
        .catch(err => console.log(err))
}
