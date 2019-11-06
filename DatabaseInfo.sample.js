module.exports = {
    getDatabaseName() {
        const database = 'your database name'
        return database
    },

    getUrlWithUsernamePassword() {
        const username = 'your username'
        const pwd = 'your password'
        const database = module.exports.getDatabaseName()
        const host = 'remote server address'
        const port = 'port number'

        const user = encodeURIComponent(username)
        const password = encodeURIComponent(pwd)

        return `mongodb://${user}:${password}@${host}:${port}/${database}`
    },

    getUrlLocalhost() {
        return 'mongodb://localhost:27017'
    }

}