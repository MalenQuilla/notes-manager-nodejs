import ConfigParser from '../utils/ConfigParser';

const NoteAlarmMail = (lastname: string, userEmail: string, title: string, description: string): {
    from: string,
    to: string,
    subject: string,
    html: string
} => {
    return {
        from: `"Notes Manager Mailer" <${ConfigParser.MAILER}>`,
        to: userEmail,
        subject: 'Notes Manager Alarm',
        html: `<!DOCTYPE html>
            <head>
                <style>
                    .note-content {
                        border: 2px solid deepskyblue;
                        padding: 20px;
                        width: 80%;
                        margin: 0 auto;
                        font-family: Arial, sans-serif;
                    }
                </style>
            </head>
            <body>
                <div>
                    <p>Dear ${lastname},</p>
                    <p>Just a friendly remind!</p>
                    <div class="note-content">
                        <b>${title}</b>
                    </div>
                    <div class="note-content">
                        <p>${description}</p>
                    </div>
                    <p>Notes Manager Dev Team,<br>Best Regards!</p>
                </div>
            </body>`,
    };
};

export default NoteAlarmMail;