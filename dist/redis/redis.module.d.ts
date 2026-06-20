import { OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';
export declare const REDIS_CLIENT = "REDIS_CLIENT";
export declare class RedisModule implements OnApplicationShutdown {
    private readonly redis;
    constructor(redis: Redis);
    onApplicationShutdown(): Promise<void>;
}
