import { env, RedisClient } from "bun";

export class RedisPubSubService {
    constructor(
        private readonly redisPub: RedisClient,
        private readonly redisSub: RedisClient,
    ) {};

    async connect() {
        await this.redisPub.connect();
        await this.redisSub.connect();
    }

    async publish(channel: string, message: string) {
        return await this.redisPub.publish(channel, message);
    };

    async subscirbe(channel: string, handler: (message: string, channel: string) => void) {
        return await this.redisSub.subscribe(channel, handler);
    };
}

export const redisPubSubService = new RedisPubSubService(
    new RedisClient(`redis://${env.REDIS_PUBSUB_HOST}:${env.REDIS_PUBSUB_PORT}`),
    new RedisClient(`redis://${env.REDIS_PUBSUB_HOST}:${env.REDIS_PUBSUB_PORT}`),
);