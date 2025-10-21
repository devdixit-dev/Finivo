import jwt from 'jsonwebtoken';

export const signToken = (payload, duration) => {
  try{
    const signedToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: duration });
    return signedToken;
  }
  catch(err) {
    console.log(`error in sign token jwt util - ${err.message}`);
    return null
  }
}

export const verifyToken = (token) => {
  try{
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  }
  catch(err) {
    console.log(`error in verify token jwt util - ${err.message}`);
    return null
  } 
}