import HTTPException from '../utils/HTTPException';
import sequelize from 'sequelize';
import {getReasonPhrase, StatusCodes} from 'http-status-codes';
import {NextFunction, Request, Response} from 'express';
import {JsonWebTokenError} from 'jsonwebtoken';

class ExceptionParser {
    parse = async (error: Error, _: Request, __: Response, next: NextFunction): Promise<void> => {
        if (!(error instanceof HTTPException)) {
            console.log('ExceptionParser: Unhandled error', error);

            const statusCode = (error instanceof sequelize.BaseError)
                ? StatusCodes.BAD_REQUEST
                : error instanceof JsonWebTokenError
                    ? StatusCodes.UNAUTHORIZED
                    : StatusCodes.INTERNAL_SERVER_ERROR;

            let message: string;

            if (error instanceof sequelize.ValidationError) {
                message = (error).errors.map((err) => err.message).join('\n');
            } else {
                message = getReasonPhrase(statusCode);
            }

            error = new HTTPException(statusCode, message, false, error.stack);
        }
        next(error);
    };
}

export default new ExceptionParser();