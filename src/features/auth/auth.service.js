import {
  generateAccessToken,
  generateRefreshToken,
} from "../../shared/utils/jwt.js";
import { userrepo } from "../users/users.repoitory.js";
import { generateHashedpassword  } from "../../shared/utils/hashedPassword.js";
import { hashToken } from "../../shared/utils/hashToken.js";
import { emailQueue } from "../../jobs/queues/email.queue.js";
import { tokenrepo } from "../../Repositores/token.repository.js";
import { comparePassword } from "../../shared/utils/comparePassword.js";
import { verifyRefreshTokens } from "../../shared/security/verifyRefreshToken.js";
import { ValidationError } from "../../errors/ValidationError.js";
import { conflictError } from "../../errors/conflictError.js";
import { logger } from "../../shared/logger/logger.js";
import { NotFoundError } from "../../errors/NotFoundError.js";

export const registerService = async ({ name, email, password }) => {
  if (!name || !email || !password) {
      throw new ValidationError("all fields are required");
    }

   
    const existingUser = await userrepo.findByEmail(email);
   
    logger.warn({
      user : existingUser,
    }, "user already exists");
    if (existingUser) {
      throw new conflictError("user already exists");
    }

    
    const hashedPassword = await generateHashedpassword(password);

   
    const newUser = await userrepo.create({
      name,
      email,
      passwordHash: hashedPassword,
    });

    await emailQueue.add("welcome-email", {
      email: newUser.email,
      name: newUser.name,
    });

    const payload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };


    const refreshToken = generateRefreshToken(payload);
    const accessToken = generateAccessToken(payload);

    
    const hashedRefreshToken = await hashToken(refreshToken);

    await tokenrepo.saveRefreshToken({
      userId: newUser.id,
      tokenHash: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    logger.info({
      safeUser, tokenHash : hashedRefreshToken
    }, "user registered successfully");

    return {
      success: true,
      user: safeUser,
      statusCode: 201,
      accessToken,
      refreshToken,
      message: "User registered successfully",
    };
};

export const loginService = async ({ email, password }) => {
  const user = await userrepo.findByEmail(email);
  
  if (!user) {
    
    throw new NotFoundError("user with this email not found");
  }

  const correctPassword = await comparePassword(password, user.passwordHash);

  if (!correctPassword) {
    logger.warn({
      user : user, correctPassword : correctPassword
    }, "password wrong");

    throw new ValidationError("password wrong");
  };

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

 
  const hashedRefreshToken = await hashToken(refreshToken);

  await tokenrepo.saveRefreshToken({
    userId: user.id,
    tokenHash: hashedRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  logger.info({
    safeUser : safeUser, hashedRefreshToken : hashedRefreshToken
  }, "login attempt successfull")

  return {
    success: true,
    statusCode: 200,
    message: "User login successful",
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const profileservice = (userId) => {
  const user = userrepo.findById(userId);

  if (!user) {
    logger({
      user : user
    }, "using wrong id to access others profile");

    throw new ValidationError("wrong id");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  logger.info(
  {
    userId: safeUser.id,
    email: safeUser.email,
  },
  "Profile viewed",
);

  return {
    success: true,
    statusCode: 200,
    user: safeUser,
  };
};



export const refreshService = async (refreshToken, refreshUser) => {
  if (!refreshToken) {
    throw new ValidationError("Token is missing");
  }


  const activeTokens = await tokenrepo.findAllActiveTokens(refreshUser.id);

  let matchedToken = null;

 
  for (const token of activeTokens) {
    const isMatch = await comparePassword(refreshToken, token.tokenHash);

    if (isMatch) {
      matchedToken = token;
      break;
    }
  }

  if (!matchedToken) {
    throw new NotFoundError("session not found");
  }


  await tokenrepo.revokedTokens(matchedToken.id);

  const payload = {
    id: refreshUser.id,
    name: refreshUser.name,
    email: refreshUser.email,
  };


  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  
  const hashedRefreshToken = await hashToken(newRefreshToken);

  
  await tokenrepo.saveRefreshToken({
    userId: refreshUser.id,
    tokenHash: hashedRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  logger.info({
    refreshToken : refreshToken
  }, 'Token refreshed successfully');

  return {
    success: true,
    statusCode: 200,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    message: "Token refreshed successfully",
  };
};

export const logOutService = async (refreshToken) => {
  if (!refreshToken) {
    throw new NotFoundError("Token not found");
  }

  const payload = verifyRefreshTokens(refreshToken);

  if (!payload) {
    logger.warn({
      refreshToken : refreshToken, payload : payload
    }, "using wrong token for logout");
    throw new ValidationError("wrong token");
  }

  const hashedToken = await hashToken(refreshToken);

  const storedToken = await tokenrepo.findByTokenHash(hashedToken);

  if (!storedToken) {
    throw new NotFoundError("Token not found in db");
  }

  if (storedToken.isRevoked) {
    throw new ValidationError("token is revoked");
  }

  if (storedToken.expiresAt < new Date()) {
    logger.warn ({
      refreshToken : refreshToken
    }, "using expired token")
    throw new ValidationError("token is expired");
  }

  await tokenrepo.revokeAllUserToken(payload.id);

  logger.info({
    refreshToken : refreshToken
  }, "logout successfull");

  return {
    success: true,
    statusCode: 200,
    message: "Logged out successfully",
  };
};