import { Router } from 'express';
import { Login, Logout, Register, VerifyEmail } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.get('/register', Register);

authRouter.put('/verify-email', VerifyEmail);

authRouter.post('/login', Login);

authRouter.post('/logout', Logout);

export default authRouter;