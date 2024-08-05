import NoteModel from '../models/NoteModel';
import DTOMapper from '../utils/DTOMapper';
import NoteStatus from '../const/NoteStatus';
import HTTPException from '../utils/HTTPException';
import StatusCodes from 'http-status-codes';
import HTTPMessage from '../const/HTTPMessage';
import NoteDTO from '../dto/NoteDTO';
import AlarmService from './AlarmService';

class NoteService {
    createNote = async (userId: number, payload: NoteModel) => {
        payload.schedule = new Date(payload.schedule);

        if (payload.schedule < new Date())
            throw new HTTPException(StatusCodes.BAD_REQUEST, HTTPMessage.NOTE_TIME_EXPIRED);

        const note = NoteModel.build({...payload, userId: userId});

        if (payload.schedule) {
            note.status = NoteStatus.SCHEDULED;
            AlarmService.configAlarm(note);
        }
        await note.save();

        return DTOMapper.toNoteDTO(note);
    };

    findAllNotes = async (userId: number) => {
        return await NoteModel.findAll({
            where: {userId: userId},
            attributes: ['id', 'title', 'description', 'schedule', 'status'],
        });
    };

    findNote = async (userId: number, noteID: number) => {
        return await NoteModel.findOne({
            where: {userId: userId, id: noteID},
            attributes: ['id', 'title', 'description', 'schedule', 'status'],
        });
    };

    updateNote = async (userId: number, noteID: number, payload: NoteDTO) => {
        let note = await NoteModel.findOne({
            where: {id: noteID, userId: userId, status: NoteStatus.AVAILABLE || NoteStatus.SCHEDULED},
        });

        if (!note)
            throw new HTTPException(StatusCodes.NOT_FOUND, HTTPMessage.NOTE_404);

        if (!payload.schedule || payload.schedule < new Date())
            throw new HTTPException(StatusCodes.BAD_REQUEST, HTTPMessage.NOTE_TIME_EXPIRED);

        payload.schedule = new Date(note.schedule);

        note = DTOMapper.toNote(note, payload);

        if (note.schedule)
            note.status = NoteStatus.SCHEDULED;

        const newNote = await note.save();

        return DTOMapper.toNoteDTO(newNote);
    };

    deleteNote = async (userId: number, noteId: number) => {
        const note = await NoteModel.findOne({
            where: {id: noteId, userId: userId, status: NoteStatus.AVAILABLE || NoteStatus.SCHEDULED},
        });

        if (!note)
            throw new HTTPException(StatusCodes.NOT_FOUND, HTTPMessage.NOTE_404);

        note.status = NoteStatus.DELETED;
        await note.save();
    };

    restoreNote = async (userId: number, noteId: number) => {
        const note = await NoteModel.findOne({
            where: {id: noteId, userId: userId, status: NoteStatus.DELETED},
        });

        if (!note)
            throw new HTTPException(StatusCodes.NOT_FOUND, HTTPMessage.NOTE_404);

        if (note.schedule && note.schedule > new Date()) {
            note.status = NoteStatus.SCHEDULED;

            AlarmService.configAlarm(note);
        } else note.status = NoteStatus.AVAILABLE;

        await note.save();
    };
}

export default new NoteService();