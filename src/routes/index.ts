import express from 'express';
import userRouter from './UserRoute';
import accountRouter from './AccountRoute';
import noteRouter from './NoteRoute';
import swaggerRouter from './SwaggerRoute';


const router = express.Router();

const routes = [
    {
        path: '/user',
        route: userRouter,
    },
    {
        path: '/account',
        route: accountRouter,
    },
    {
        path: '/note',
        route: noteRouter,
    },
    {
        path: '/api-docs',
        route: swaggerRouter,
    }
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;