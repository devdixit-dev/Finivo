import jwt from 'jsonwebtoken';

export const signToken = (payload, duration) => {
  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: duration });
  return signedToken;
}

export const verifyToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken;
}