const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
router.get('/list', (req, res) => {
    res.json({
        name: 1
    })
})
router.get('/getEmailAvatar', (req, res) => {
    const avatar  = gravatar.url('11615206415@qq.com', {s: '200', r: 'pg', d: 'mm'});
    res.sendFile(avatar)
})
module.exports = router