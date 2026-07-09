import jwt from "jsonwebtoken";


export const generateAccessToken =  (payload) => {

    const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRES_IN,

        }

    )

    return accessToken;
}


export const generateRefreshToken = (payload) => {
    const refreshToken =   jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn :  process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    )
    return refreshToken;
}