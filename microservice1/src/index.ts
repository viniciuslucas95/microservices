import express, { json } from 'express'
import { RabbitMq } from './RabbitMq'

const server = express()
const rabbitmq = new RabbitMq('amqp://admin:admin@rabbitmq:5672');

server.use(json())

server.post('/', async (req, res) => {
    await rabbitmq.start()
    await rabbitmq.publishInExchange(req.body)
    await rabbitmq.close()

    res.json({ status: 'ok' })
})

server.listen(3000, () => {
    console.log('Server started...')
})