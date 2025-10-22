import { Router } from 'express';
import userRoutes from './usersRoute.js';
import modsRoute from './modsRoute.js';
import targetDataRoutes from './targetDataRoute.js';
import authenticateModRoutes from './authenticateModRoute.js';
import dripHistoryRoutes from './dripHistoryRoute.js';
import registeredModRoutes from './registeredModRoute.js';

let rootRouter = Router();

rootRouter.use('/users', userRoutes);
rootRouter.use('/mods', modsRoute);
rootRouter.use('/target_data', targetDataRoutes);
rootRouter.use('/authenticate_mod', authenticateModRoutes);
rootRouter.use('/drip_history', dripHistoryRoutes);
rootRouter.use('/register_mod', registeredModRoutes);

rootRouter.get('/', (req, res) => {
  res.status(200).send('Welcome to MoDrip');
});

export default rootRouter;
