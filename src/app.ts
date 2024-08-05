import express, {Express} from 'express';
import helmet from 'helmet';
// import * as xss from "xss-clean";
import cors from 'cors';
import ExceptionParser from './middlewares/ExceptionParser';
import ExceptionHandler from './middlewares/ExceptionHandler';
import router from './routes';
import config from './utils/ConfigParser';
import DBConfig from './configs/DBConfig';
import RedisConfig from './configs/RedisConfig';
import MailerConfig from './configs/MailerConfig';

const app = express();

function bootstrap(app: Express): void {
    app.use(helmet());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    // app.use(xss());

    app.use(cors());
    app.options('*', cors());

    app.use('/api/v1', router);

    app.use(ExceptionParser.parse);

    app.use(ExceptionHandler.handle);

    const PORT = config.PORT;
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

Promise.all([DBConfig.getSequelize(), RedisConfig.getClient(), MailerConfig.getTransporter()])
       .then(() => bootstrap(app))
       .catch((error: Error) => {console.error(`NotesManager: ${error.message}`);});