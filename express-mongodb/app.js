// const { urlencoded } = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')

const mongoUrl = require('./config/keys').mongoUrl
mongoose.connect(mongoUrl, {
    useUnifiedTopology:true,
    useNewUrlParser: true
}).then(res => {
    console.log('mongodb 连接成功');
})


const users = require('./routes/api/users')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/api/users/', users)

app.get('/', (req, res) => {
    res.send('hello mongoose')
})

app.post('/testPost', (req, res) => {
    console.log(req.body);
    res.send(req.body)
})

app.listen('3000', () => {
    console.log('running prot 3000');
})