import Joi from 'joi';
import {Request, Response, NextFunction} from 'express';
import StatusCodes, {ReasonPhrases} from 'http-status-codes';
import HTTPException from '../utils/HTTPException';

class ValidationHandler {
    validate = (schema: Joi.ObjectSchema, property: keyof Request) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const requestElement = req[property];
            if (!requestElement) {
                throw new HTTPException(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST);
            }

            try {
                await schema.validateAsync(requestElement);
                return next();
            } catch (error) {
                console.log(error);
                const messages = (error as Joi.ValidationError).details.map((err) => err.message).join('\n');

                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: StatusCodes.BAD_REQUEST,
                    message: ReasonPhrases.BAD_REQUEST,
                    error: messages,
                });
            }
        }
    }
}

export default new ValidationHandler();