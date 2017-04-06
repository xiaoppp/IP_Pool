## IP proxy pool implemented by NodeJS
Thanks to https://github.com/jhao104/proxy_pool

### where proxies store
    Using Redis to store all the ip proxies, so you need install node-redis first

### get proxy strategy
    first, get proxy from proxy pool
    second, test whether this proxy can work
    if it can work, return this proxy
    else we will repeat this process again

### Schedule
    using node-cron to get all proxies per hour

### Test
    using ava to unit test
