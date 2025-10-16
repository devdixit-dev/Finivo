import { verifyToken } from "../utils/jwt.util.js";

export const isAuthenticated = async (req, res, next) => {
  try{
    const token = req.cookies.a_token;
    if(!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const verifiedUser = verifyToken(token);
    if(!verifiedUser) {
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if(!verifiedUser.role === 'user') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access denied'
      });
    }

    req.user = verifiedUser;
    next();
  }
  catch(err) {
    console.log(`Error in authentication middleware - ${err}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}