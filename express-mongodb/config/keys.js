const userName = 'wangjin'
const password = 'wangjin'
const dataBaseName = 'test'

module.exports = {
    mongoUrl: `mongodb+srv://${userName}:${password}@test-wj.9kpu0.azure.mongodb.net/${dataBaseName}?retryWrites=true&w=majority`
}