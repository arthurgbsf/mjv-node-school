import {Router} from 'express';
import usersRouter from './users.router';
import workoutsRouter from './workouts.router';
import exercisesRouter from './exercises.router';


const router = Router();

router.use('/users', usersRouter);

router.use('/workouts', workoutsRouter);

router.use('/exercises', exercisesRouter);

export default router;