import type {RedisClientType} from 'redis';
import {createClient} from 'redis';

class RedisConfig {
    redisClient?: RedisClientType;

    async init(): Promise<void> {
        this.redisClient = createClient({
            url: 'redis://redisdb:6379'
        });
        this.redisClient.on('error',
            err => console.error(`RedisConfig: Redis error: ${err}`));
        this.redisClient.on('connect', () => console.info('RedisConfig: Redis connected'));
        this.redisClient.on('reconnecting',
            () => console.info('RedisConfig: Redis reconnecting'));
        this.redisClient.on('ready', () => console.info('RedisConfig: Redis ready!'));
        await this.redisClient.connect();
    }

    async disconnect(): Promise<void> {
        if (this.redisClient) {
            await this.redisClient.quit();
            this.redisClient = undefined;
        }
        console.log('Redis disconnected');
    }

    async getClient(): Promise<RedisClientType> {
        if (!this.redisClient)
            this.init().then(() => console.log('RedisConfig: Redis connected'));

        if (!this.redisClient)
            throw new Error('RedisConfig: Redis connection failed');

        return this.redisClient;
    }
}

export default new RedisConfig();