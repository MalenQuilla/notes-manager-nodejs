import {NextFunction, Request, Response} from 'express';
import UserService from '../services/UserService';
import {ReasonPhrases, StatusCodes} from 'http-status-codes';

class UserController {
    async createUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const data = await UserService.createUser(request.body);

            response.status(StatusCodes.CREATED).json({
                status: StatusCodes.CREATED,
                message: ReasonPhrases.CREATED,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    async updateUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const data = await UserService.updateUser(Number(request.params.id), request.body);

            response.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    async deleteUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const data = await UserService.deleteUser(Number(request.params.id));

            response.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    async activeUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const data = await UserService.activeUser(Number(request.params.id));

            response.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    async restrictUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const data = await UserService.restrictUser(Number(request.params.id));

            response.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    async findAllUsers(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let data;

            if (!request.body || !request.body.offset || !request.body.limit)
                data = await UserService.findAllUsers();
            else data = await UserService.findAllUsers(Number(request.body.offset), Number(request.body.limit));

            response.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    async findUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const data = await UserService.findOneUser(Number(request.params.id));

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

export default new UserController();