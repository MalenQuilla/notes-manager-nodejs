import Joi from 'joi';

class UserValidation {
    baseSchema = {
        firstname: Joi.string(),

        lastname: Joi.string(),

        username: Joi.string(),

        email: Joi.string()
                  .email({minDomainSegments: 2, tlds: {allow: ['com', 'vn', 'group', 'net']}}),

        password: Joi.string()
                     .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

        role: Joi.string(),

        status: Joi.string(),
    };

    createUser = Joi.object(Object.fromEntries(Object.entries(this.baseSchema)
                                                     .map(([key, value]) => [
                                                         key,
                                                         ['role', 'status', 'firstname'].includes(key)
                                                             ? value
                                                             : value.required(),
                                                     ])),
    );

    updateUser = Joi.object(this.baseSchema);
}

export default new UserValidation();