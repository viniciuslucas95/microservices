import { Connection, Channel, connect } from 'amqplib'

export class RabbitMq {
    private _connection?: Connection
    private _channel?: Channel

    constructor(private readonly uri: string) { }

    async start() {
        if (this._channel) throw new Error("Already connected")

        this._connection = await connect(this.uri)
        this._channel = await this._connection.createChannel()
    }

    checkStarted() {
        if (this._channel) throw new Error("Not connected. Setup it first.")
    }

    async publishInExchange(content: object, routingKey: 'm2' | 'm3' | 'm1' | '' = '') {
        if (!this._channel) throw new Error("No channel open")

        return this._channel.publish('microservico', routingKey, Buffer.from(JSON.stringify(content)))
    }

    async consume(queue: 'microservico1' | 'microservico2' | 'microservico3', callback: (content?: object) => void) {
        if (!this._channel) throw new Error("No channel open")

        return this._channel.consume(queue, message => {
            if (!message) return

            this._channel?.ack(message)

            callback(JSON.parse(message.content.toString()))
        })
    }

    async close() {
        await this._channel?.close()

        this._channel = undefined

        await this._connection?.close()

        this._connection = undefined
    }
}