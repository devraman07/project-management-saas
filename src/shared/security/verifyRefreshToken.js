import jwt from "jsonwebtoken";



export const verifyRefreshTokens = (token) => {
    const verifiedToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return verifiedToken;
    
};