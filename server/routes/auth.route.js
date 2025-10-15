import { Router } from 'express';
import { Register } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.get('/', Register);

export default authRouter;