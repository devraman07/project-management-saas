// src/shared/utils/hashToken.js
import crypto from "crypto";

const TOKEN_HASH_SECRET = process.env.TOKEN_HASH_SECRET;

export const hashToken = (token) => {
  return crypto
    .createHmac("sha256", TOKEN_HASH_SECRET)
    .update(token)
    .digest("hex");
};