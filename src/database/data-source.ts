import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const isCompiled = __filename.endsWith('.js');
const ext = isCompiled ? '.js' : '.ts';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'mms_cantine',
  entities: [path.resolve(__dirname, `../**/*.entity${ext}`)],
  migrations: [path.resolve(__dirname, `./migrations/*${ext}`)],
  synchronize: false,
  logging: true,
});
