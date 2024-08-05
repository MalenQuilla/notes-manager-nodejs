import mailer, {Transporter} from 'nodemailer';
import ConfigParser from '../utils/ConfigParser';
class MailerConfig {
    private transporter!: Transporter;

    private init() {
        this.transporter = mailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            auth: {
                user: ConfigParser.MAILER,
                pass: ConfigParser.MAILER_PW,
            },
        });

        console.log('MailerConfig: transporter initialized.');
    };

    getTransporter() {
        if (!this.transporter)
            this.init();

        return this.transporter;
    }
}

export default new MailerConfig();