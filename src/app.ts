import express from 'express';
import helmet from 'helmet';
// import * as xss from "xss-clean";
import cors from 'cors';
import ExceptionParser from './middlewares/ExceptionParser';
import ExceptionHandler from './middlewares/ExceptionHandler';
import router from './routes';
import config from './utils/ConfigParser';

const app = express();

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