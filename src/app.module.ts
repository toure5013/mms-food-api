import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';

import { getWinstonConfig } from './common/logger/logger.config';
import { TypeOrmWinstonLogger } from './database/typeorm-logger';

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { User } from './users/user.entity';
import { Organisation } from './organisations/organisation.entity';
import { Dish } from './dishes/dish.entity';
import { Menu } from './menus/menu.entity';
import { Order } from './orders/order.entity';
import { Payment } from './payments/payment.entity';
import { Wallet } from './wallet/wallet.entity';
import { WalletTransaction } from './wallet/wallet-transaction.entity';
import { Notification } from './notifications/notification.entity';
import { LoyaltyTransaction } from './loyalty/loyalty-transaction.entity';
import { Settings } from './settings/settings.entity';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganisationsModule } from './organisations/organisations.module';
import { DishesModule } from './dishes/dishes.module';
import { MenusModule } from './menus/menus.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { WalletModule } from './wallet/wallet.module';
import { NotificationsModule } from './notifications/notifications.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { StorageModule } from './storage/storage.module';
import { SettingsModule } from './settings/settings.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    // Config globale (.env)
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting: 100 requêtes / 60 secondes
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Logger
    WinstonModule.forRoot(getWinstonConfig()),

    // TypeORM PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        database: config.get('DB_NAME', 'mms_db'),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASS', 'postgres'),
        entities: [User, Organisation, Dish, Menu, Order, Payment, Wallet, WalletTransaction, Notification, LoyaltyTransaction, Settings],
        synchronize: config.get('NODE_ENV') !== 'production', // migrations en prod
        logging: 'all',
        logger: new TypeOrmWinstonLogger(),
      }),
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    OrganisationsModule,
    DishesModule,
    MenusModule,
    OrdersModule,
    PaymentsModule,
    WalletModule,
    NotificationsModule,
    LoyaltyModule,
    StorageModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Guards globaux
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    
    // Logging & Erreur globaux
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
