import {NextFunction, Request, Response} from 'express';
import NoteService from '../services/NoteService';
import StatusCodes, {ReasonPhrases} from 'http-status-codes';

class NoteController {
    createNote = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await NoteService.createNote(req.user?.id, req.body);

            res.status(StatusCodes.CREATED).send({
                statusCode: StatusCodes.CREATED,
                message: ReasonPhrases.CREATED,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    updateNote = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await NoteService.updateNote(req.user?.id, Number(req.params.id), req.body);

            res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    findAllNotes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await NoteService.findAllNotes(req.user?.id);

            res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    findNote = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await NoteService.findNote(req.user?.id, Number(req.params.id));

            res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteNote = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await NoteService.deleteNote(req.user?.id, Number(req.params.id));

            res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    restoreNote = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await NoteService.restoreNote(req.user?.id, Number(req.params.id));

            res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

}

export default new NoteController();