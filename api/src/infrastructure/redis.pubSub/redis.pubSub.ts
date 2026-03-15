import { RedisClient } from "bun";

export class RedisPubSubService {
    redisClient: RedisClient;

    constructor(pubSubUrl: string) {
        this.redisClient = new RedisClient(pubSubUrl);
    };

    async getWriter() {
        const writer = await this.redisClient.connect();
        return writer;
    }

    async getListen() {
        const listener = await this.redisClient.connect();
        return listener;
    }
}