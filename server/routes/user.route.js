import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { Dashboard } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/dashboard', isAuthenticated, Dashboard);

export default userRouter;