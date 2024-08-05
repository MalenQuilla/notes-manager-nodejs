import {Sequelize} from 'sequelize-typescript';
import config from '../utils/ConfigParser';

class DBConfig {
    private sequelize!: Sequelize;

    private init() {
        this.sequelize = new Sequelize({
            host: 'mysqldb',
            port: 3307,
            database: config.DB_NAME,
            username: config.DB_UNAME,
            password: config.DB_PW,
            dialect: config.DIA,
            models: [__dirname + 'src/models'],
        });

        console.log("DBConfig: ", this.sequelize.authenticate());
    };

    getSequelize() {
        if (!this.sequelize)
            this.init();

        return this.sequelize;
    };
}
export default new DBConfig();