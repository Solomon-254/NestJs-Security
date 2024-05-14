import { DataSource } from "typeorm";
import { join } from "path";
import * as dotenv from 'dotenv';


dotenv.config();

export default new DataSource({  //dev migrations
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: ['migrations/**/*{.ts,.js}'],
  entities: [join(__dirname, '**', '*.entity.{ts,js}')]
})  









