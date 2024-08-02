import Joi from 'joi';

class AuthValidation {
    signUp = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'vn', 'group', 'net']}}).required(),
        firstname: Joi.string(),
        lastname: Joi.string().required(),
    });

    signIn = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    });

    refresh = Joi.object({
        refreshToken: Joi.string().required(),
    });

    activate = Joi.object({
        id: Joi.number().required(),
        activationCode: Joi.string().required(),
    })
}

export default new AuthValidation();