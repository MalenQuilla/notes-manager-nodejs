import HTTPException from '../utils/HTTPException';
import {getReasonPhrase, ReasonPhrases} from 'http-status-codes';
import {NextFunction, Request, Response} from 'express';

class ExceptionHandler {
    handle = async (error: HTTPException, _: Request, response: Response, __: NextFunction) => {
        const isDefinedException = !Object.values(ReasonPhrases)
                                          .includes(error.message as ReasonPhrases);

        return response.status(error.statusCode).json({
            statusCode: error.statusCode,
            message: getReasonPhrase(error.statusCode),
            error: isDefinedException
                ? error.message
                : undefined,
        });
    };
}

export default new ExceptionHandler();