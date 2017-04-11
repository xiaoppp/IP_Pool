const proxyManager = require('../proxy')

if (require.main === module) {
    proxyManager.scheduleProxy()
        .then(data => console.log(data))
        .catch(err => console.log(err))
}
