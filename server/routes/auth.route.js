import { Router } from 'express';
import { Login, Logout, Register, VerifyEmail } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.get('/register', Register);

authRouter.put('/verify-email', VerifyEmail);

authRouter.post('/login', Login);

authRouter.post('/logout', isAuthenticated, Logout);

export default authRouter;