import express from 'express'

const server = express()

server.use('/', (req, res) => {
    res.json({ microservice: 2 })
})

server.listen(3000, () => {
    console.log('Server started...')
})