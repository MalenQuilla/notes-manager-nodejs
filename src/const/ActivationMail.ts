import ConfigParser from '../utils/ConfigParser';

const ActivationMail = (lastname: string, userEmail: string, username: string, activateLink: string): {
    from: string,
    to: string,
    subject: string,
    text: string
} => {
    return {
        from: `"Notes Manager Mailer" <${ConfigParser.MAILER}>`,
        to: userEmail,
        subject: 'Notes Manager Account Activation',
        text: `Dear ${lastname},
            \nYour Notes Manager account for ${username} is almost ready for action!
            \nFollow this link to complete your registration:\n${activateLink}
            \nNotes Manager Dev Team,\nBest Regard!`,
    };
};

export default ActivationMail;