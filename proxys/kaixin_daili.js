// http://www.kxdaili.com/dailiip/1/2.html#ip

const request = require('superagent');
const cheerio = require('cheerio')
const Address = require('./Address')
const header = require('../header')

// 抓取开心 http://www.kxdaili.com/
async function proxy(pages=1) {
    let list = []
    for (let i = 0; i < pages; i++) {
        const url = `http://www.kxdaili.com/dailiip/1/${i}.html#ip`
        console.log(url)
        const data = await request.get(url).set(header)
        const html = data.text
        console.log(html)
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
