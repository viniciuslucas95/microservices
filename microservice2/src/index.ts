import express, { json } from 'express'
import { RabbitMq } from './RabbitMq';

const server = express()
const rabbitmq = new RabbitMq('amqp://admin:admin@rabbitmq:5672');
const contents: object[] = []

server.get('/', (req, res) => {
    try {
        rabbitmq.checkStarted()
    } catch (err: any) {
        res.json({ error: err.message })
    }

    const count = contents.length

    if (count > 0) {
        res.json({ currentContent: contents[0], count })
        contents.shift()
        return
    }

    res.json({ currentContent: undefined, count })
})

server.post('/setup', async (req, res) => {
    try {
        await rabbitmq.start()
        await rabbitmq.consume('microservico2', content => {
            if (content)
                contents.push(content)
        })

        res.json({ status: 'setup' })
    } catch (err: any) {
        res.json({ error: err.message })
    }
})

server.listen(3000, () => {
    console.log('Server started...')
})