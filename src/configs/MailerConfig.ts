import mailer from 'nodemailer';
import ConfigParser from '../utils/ConfigParser';

const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
        user: ConfigParser.MAILER,
        pass: ConfigParser.MAILER_PW,
    },
});

export default transporter;