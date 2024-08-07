import HTTPException from './HTTPException';
import StatusCodes, {ReasonPhrases} from 'http-status-codes';
import {Dialect} from 'sequelize/types/sequelize';

// dotenv.config({path: 'src/configs/.env'});

interface ENV {
    PORT: number | undefined;
    DB_NAME: string | undefined;
    DIA: string | undefined;
    DB_UNAME: string | undefined;
    DB_PW: string | undefined;
    SALT: number | undefined;
    SECRET: string | undefined;
    ACCESS_EXP: number | undefined;
    REFRESH_EXP: number | undefined;
    KEY_EXP: number | undefined;
    MAILER: string | undefined;
    MAILER_PW: string | undefined;
    DOMAIN_NAME: string | undefined;
}

interface Config {
    PORT: number;
    DB_NAME: string;
    DIA: Dialect;
    DB_UNAME: string;
    DB_PW: string;
    SALT: number;
    SECRET: string;
    ACCESS_EXP: number;
    REFRESH_EXP: number;
    KEY_EXP: number;
    MAILER: string;
    MAILER_PW: string;
    DOMAIN_NAME: string;
}

const getENV = (): ENV => {
    return {
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        DB_NAME: process.env.DB_NAME,
        DIA: process.env.DIA,
        DB_UNAME: process.env.DB_UNAME,
        DB_PW: process.env.DB_PW,
        SALT: process.env.SALT ? Number(process.env.SALT) : undefined,
        SECRET: process.env.SECRET,
        ACCESS_EXP: process.env.ACCESS_EXP
            ? Number(process.env.ACCESS_EXP)
            : undefined,
        REFRESH_EXP: process.env.REFRESH_EXP
            ? Number(process.env.REFRESH_EXP)
            : undefined,
        KEY_EXP: process.env.KEY_EXP ? Number(process.env.KEY_EXP) : undefined,
        MAILER: process.env.MAILER,
        MAILER_PW: process.env.MAILER_PW,
        DOMAIN_NAME: process.env.DOMAIN_NAME,
    };
};

const getConfig = (env: ENV): Config => {
    for (const [key, value] of Object.entries(env)) {
        if (value === undefined) {
            console.log('Missing config key: ', key);
            throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR,
                ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
    }
    return env as Config;
};

export default getConfig(getENV());