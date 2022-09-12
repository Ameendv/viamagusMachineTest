const express = require('express')
const app = express()
require('dotenv').config()
const adminController = require('../../controller/admin/admin')
const jwt = require('jsonwebtoken')
const { createError } = require('../../createError/createError')

app.post('/api/login', adminController.login)

app.post('/api/create-task', authenticateToken, adminController.createTask)

app.post('/api/add-team', authenticateToken, adminController.addTeam)

app.put('/api/assign-task', authenticateToken, adminController.assignTask)

app.get('/api/get-tasks', authenticateToken, adminController.getTasks)

app.put('/api/edit-status', authenticateToken, adminController.editStatus)

app.put('/api/edit-properties', authenticateToken, adminController.editProperties)
function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    // eslint-disable-next-line no-undef
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return next(createError(403, 'Authentication failed'))
        req.user = user
        next()
    })


}

module.exports = app;