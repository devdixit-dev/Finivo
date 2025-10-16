import { Router } from 'express';
import { Login, Logout, Register, VerifyEmail } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', Register);

authRouter.post('/verify', VerifyEmail);

authRouter.post('/login', Login);

authRouter.post('/logout', isAuthenticated, Logout);

export default authRouter;