import swaggerUi from 'swagger-ui-express';
import express from 'express';
import swaggerDocument from './swagger.json'

const swaggerRouter = express.Router();

swaggerRouter.use('/', swaggerUi.serve)
             .get('/', swaggerUi.setup(swaggerDocument));

export default swaggerRouter;