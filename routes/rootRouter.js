import { Router } from 'express';
import userRoutes from './usersRoute.js';
import loginRoute from './loginRoute.js';
import modRoutes from './modRoute.js';
import targetDataRoutes from './targetDataRoute.js';

let rootRouter = Router();

rootRouter.use('/users', userRoutes);
rootRouter.use('/login', loginRoute);
rootRouter.use('/mods', modRoutes);
rootRouter.use('/target_data', targetDataRoutes);

rootRouter.get('/', (req, res) => {
  res.status(200).send('Welcome to MoDrip');
});

export default rootRouter;
