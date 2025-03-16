import { Router } from 'express';
import userRoutes from './usersRoute.js';
import modsRoute from './modsRoute.js';
import targetDataRoutes from './targetDataRoute.js';
import refreshTokenRoute from './refreshTokenRoute.js';

let rootRouter = Router();

rootRouter.use('/users', userRoutes);
rootRouter.use('/mods', modsRoute);
rootRouter.use('/target_data', targetDataRoutes);
rootRouter.use('/refresh_token', refreshTokenRoute);

rootRouter.get('/', (req, res) => {
  res.status(200).send('Welcome to MoDrip');
});

export default rootRouter;
