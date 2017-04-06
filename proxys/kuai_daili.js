
// 抓取快代理IP http://www.kuaidaili.com/
// :param page: 翻页数
// 暂时不好用，需要重新解析

async function kuaidaili(pages=10) {
    console.log(pages)
    const address_list = []
    for (let i=1; i<=pages; i++) {
        const url = `http://www.kuaidaili.com/proxylist/${i}/`
        console.log(url)
        const res = await request.get(url)
        console.log(res)
        if (res.status == 200) {
            const data = res.body
            const parser = cheerio.load(data)
            const IP = parser('tr td[data-title=IP]').text()
            const port = parser('tr td[data-title=PORT]').text()
            const address = new Address(IP, port)
            address_list.push(address)
        }
    }
    return address_list
}

module.exports = kuaidaili
