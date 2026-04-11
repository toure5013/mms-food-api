"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const organisations_module_1 = require("./organisations/organisations.module");
const dishes_module_1 = require("./dishes/dishes.module");
const menus_module_1 = require("./menus/menus.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const wallet_module_1 = require("./wallet/wallet.module");
const notifications_module_1 = require("./notifications/notifications.module");
const loyalty_module_1 = require("./loyalty/loyalty.module");
const storage_module_1 = require("./storage/storage.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const user_entity_1 = require("./users/user.entity");
const organisation_entity_1 = require("./organisations/organisation.entity");
const dish_entity_1 = require("./dishes/dish.entity");
const menu_entity_1 = require("./menus/menu.entity");
const order_entity_1 = require("./orders/order.entity");
const payment_entity_1 = require("./payments/payment.entity");
const wallet_entity_1 = require("./wallet/wallet.entity");
const wallet_transaction_entity_1 = require("./wallet/wallet-transaction.entity");
const notification_entity_1 = require("./notifications/notification.entity");
const loyalty_transaction_entity_1 = require("./loyalty/loyalty-transaction.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 5432),
                    database: config.get('DB_NAME', 'mms_db'),
                    username: config.get('DB_USER', 'postgres'),
                    password: config.get('DB_PASS', 'postgres'),
                    entities: [user_entity_1.User, organisation_entity_1.Organisation, dish_entity_1.Dish, menu_entity_1.Menu, order_entity_1.Order, payment_entity_1.Payment, wallet_entity_1.Wallet, wallet_transaction_entity_1.WalletTransaction, notification_entity_1.Notification, loyalty_transaction_entity_1.LoyaltyTransaction],
                    synchronize: config.get('NODE_ENV') !== 'production',
                    logging: config.get('NODE_ENV') === 'development',
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            organisations_module_1.OrganisationsModule,
            dishes_module_1.DishesModule,
            menus_module_1.MenusModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            wallet_module_1.WalletModule,
            notifications_module_1.NotificationsModule,
            loyalty_module_1.LoyaltyModule,
            storage_module_1.StorageModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map