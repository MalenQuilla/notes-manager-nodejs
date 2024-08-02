import AccountService from '../services/AccountService';
import {NextFunction, Request, Response} from 'express';
import StatusCodes, {ReasonPhrases} from 'http-status-codes';

class AccountController {
    async signUp(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const data = await AccountService.signUp(request.body);

            response.status(StatusCodes.CREATED).json({
                status: StatusCodes.CREATED,
                message: ReasonPhrases.CREATED,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    async signIn(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const data = await AccountService.signIn(request.body);

            response.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    async getNewAccessToken(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const data = await AccountService.getNewAccessToken(request.body.refreshToken);

            response.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    async requestActivation(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            // const data = await AccountService.requestActivation(
            //     `${request.protocol}://${request.get('host')}`, Number(request.params.id));

            const data = await AccountService.requestActivation('http://notes.manager.com', Number(request.params.id));

            response.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    async activateAccount(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const data = await AccountService.activateAccount(Number(request.params.id), request.params.activationCode);

            response.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new AccountController();