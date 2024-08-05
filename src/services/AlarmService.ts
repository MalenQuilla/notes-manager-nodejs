import NoteModel from '../models/NoteModel';
import scheduler from 'node-schedule';
import NoteStatus from '../const/NoteStatus';
import UserModel from '../models/UserModel';
import UserStatus from '../const/UserStatus';
import MailerConfig from '../configs/MailerConfig';
import NoteAlarmMail from '../const/NoteAlarmMail';

class AlarmService {
    configAlarm = (note: NoteModel) => {
        const date = new Date(note.schedule);
        const scheduledTask = scheduler.scheduleJob(date, async function() {
            console.log('NoteService: sending alarm');
            if (note.status === NoteStatus.SCHEDULED) {
                note.status = NoteStatus.AVAILABLE;
                await note.save();

                const user = await UserModel.findOne({where: {id: note.userId, status: UserStatus.ACTIVE}});

                if (!user) {
                    console.log('NoteService: cannot send alarm since user not found');
                    scheduledTask.cancel();
                    return;
                }

                const transporter = MailerConfig.getTransporter();
                transporter.sendMail(
                    NoteAlarmMail(user.lastname, user.email, note.title, note.description),
                    (error, info) => {
                        error && console.error('NoteService: alarm: ', error);
                        info && console.log('NoteService: alarm: ', info);
                    });
            }
        });
    };

    // TODO: Time is buggy af. Migrate to node-schedule
    // configAlarm = (note: NoteModel) => {
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
    //                     const transporter = MailerConfig.getTransporter();
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
}

export default new AlarmService();