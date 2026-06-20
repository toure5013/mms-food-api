"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = exports.REDIS_CLIENT = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
exports.REDIS_CLIENT = 'REDIS_CLIENT';
let RedisModule = class RedisModule {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async onApplicationShutdown() {
        await this.redis.quit();
    }
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: exports.REDIS_CLIENT,
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const host = config.get('REDIS_HOST', 'localhost');
                    const port = config.get('REDIS_PORT', 6379);
                    const password = config.get('REDIS_PASSWORD');
                    const client = new ioredis_1.default({
                        host,
                        port,
                        ...(password ? { password } : {}),
                        maxRetriesPerRequest: 3,
                        enableReadyCheck: true,
                        lazyConnect: false,
                    });
                    client.on('connect', () => console.log(`✅ Redis connecté — ${host}:${port}`));
                    client.on('error', (err) => console.error('❌ Redis erreur :', err.message));
                    return client;
                },
            },
        ],
        exports: [exports.REDIS_CLIENT],
    }),
    __param(0, (0, common_1.Inject)(exports.REDIS_CLIENT)),
    __metadata("design:paramtypes", [ioredis_1.default])
], RedisModule);
//# sourceMappingURL=redis.module.js.map