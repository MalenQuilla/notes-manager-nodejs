import NoteModel from '../models/NoteModel';
import DTOMapper from '../utils/DTOMapper';
import NoteStatus from '../const/NoteStatus';
import HTTPException from '../utils/HTTPException';
import StatusCodes from 'http-status-codes';
import HTTPMessage from '../const/HTTPMessage';
import scheduler from 'node-schedule';
import transporter from '../configs/MailerConfig';
import NoteAlarmMail from '../const/NoteAlarmMail';
import UserModel from '../models/UserModel';
import UserStatus from '../const/UserStatus';
import NoteDTO from '../dto/NoteDTO';

class NoteService {
    // TODO: Time is buggy af. Migrate to node-schedule
    // private configAlarm = (note: NoteModel) => {
    //     const schedule: Date = note.schedule;
    //     const cronExpression =
    //         `${schedule.getSeconds()} ${schedule.getMinutes()} ${schedule.getHours()} ${schedule.getDate()} ${schedule.getMonth()} ${schedule.getDay()}`;
    //
    //     const cronTask = cron.schedule(
    //         cronExpression,
    //         async () => {
    //             try {
    //                 console.log("NoteService: sending alarm")
    //                 if (note.status === NoteStatus.SCHEDULED) {
    //                     note.status = NoteStatus.AVAILABLE;
    //                     await note.save();
    //
    //                     const user = await UserModel.findOne({where: {id: note.userId, status: UserStatus.ACTIVE}});
    //
    //                     if (!user) {
    //                         console.log('NoteService: cannot send alarm since user not found');
    //                         return;
    //                     }
    //
    //                     const info = transporter.sendMail(
    //                         NoteAlarmMail(user.lastname, user.email, note.title, note.description));
    //                     console.log('NoteService: alarm: ', info);
    //                 }
    //             } finally {
    //                 cronTask.stop();
    //             }
    //         }, {
    //             scheduled: true,
    //             name: `note ${note.id}`,
    //             timezone: 'Etc/UTC',
    //         });
    //     cronTask.start();
    // };

    createNote = async (userId: number, payload: NoteModel) => {
        payload.schedule = new Date(payload.schedule);

        if (payload.schedule < new Date())
            throw new HTTPException(StatusCodes.BAD_REQUEST, HTTPMessage.NOTE_TIME_EXPIRED);

        const note = NoteModel.build({...payload, userId: userId});

        if (payload.schedule) {
            note.status = NoteStatus.SCHEDULED;
            this.configAlarm(note);
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

            this.configAlarm(note);
        } else note.status = NoteStatus.AVAILABLE;

        await note.save();
    };

    private configAlarm = (note: NoteModel) => {
        const date = new Date(note.schedule);
        const cronTask = scheduler.scheduleJob(date, async function() {
            console.log('NoteService: sending alarm');
            if (note.status === NoteStatus.SCHEDULED) {
                note.status = NoteStatus.AVAILABLE;
                await note.save();

                const user = await UserModel.findOne({where: {id: note.userId, status: UserStatus.ACTIVE}});

                if (!user) {
                    console.log('NoteService: cannot send alarm since user not found');
                    cronTask.cancel();
                    return;
                }

                const info = transporter.sendMail(
                    NoteAlarmMail(user.lastname, user.email, note.title, note.description));
                console.log('NoteService: alarm: ', info);
            }
        });
    };
}

export default new NoteService();