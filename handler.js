'use strict';

const sls = require('serverless-http')
const express = require('express')
const app = express()

app.get('/', async (req, res, next) => {
    res.status(200).send('Hello World!')
})

module.exports.server = sls(app)
