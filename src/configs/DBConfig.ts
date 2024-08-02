import {Sequelize} from 'sequelize-typescript';
import config from '../utils/ConfigParser';

const sequelize = new Sequelize({
    host: "mysqldb",
    port: 3306,
    database: config.DB_NAME,
    username: config.DB_UNAME,
    password: config.DB_PW,
    dialect: config.DIA,
    models: [__dirname + 'src/models'],
});

console.log("DBConfig: ", sequelize.authenticate());

export default sequelize;