const CronJob = require('cron').CronJob
const proxy = require('../IP_pool_proxy/proxy')
const moment = require('moment')

// 每1小时执行一次
const ip_proxy_Job = new CronJob({
    cronTime: '0 0 */1 * * * ',
    // cronTime: '* */1 * * * * ',
    onTick: function () {
        console.log('================ ip_proxy_Job ===============')
        console.log('查找更新所有可用的ip')
        proxy.checkProxy()
        proxy.scheduleProxy()
    },
    start: true,
    timeZone: 'Asia/Shanghai'
})
ip_proxy_Job.start()
