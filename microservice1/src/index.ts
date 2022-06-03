import express from 'express'

const server = express()

server.use('/', (req, res) => {
    res.json({ microservice: 1 })
})

server.listen(3000, () => {
    console.log('Server started...')
})