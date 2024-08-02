import express from 'express';
import AccountController from '../controllers/AccountController';
import ValidationHandler from '../middlewares/ValidationHandler';
import AuthValidation from '../validations/AuthValidation';

const accountRouter = express.Router();

accountRouter.post('/signup', ValidationHandler.validate(AuthValidation.signUp, 'body'),
                 AccountController.signUp)

             .post('/signin', ValidationHandler.validate(AuthValidation.signIn, 'body'),
                 AccountController.signIn)

             .post('/refresh', ValidationHandler.validate(AuthValidation.refresh, 'body'),
                 AccountController.getNewAccessToken)

             .post('/:id',
                 AccountController.requestActivation)

             .get('/:id/:activationCode', ValidationHandler.validate(AuthValidation.activate, 'params'),
                 AccountController.activateAccount);

export default accountRouter;