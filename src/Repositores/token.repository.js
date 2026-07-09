import { and, eq } from "drizzle-orm";
import { db } from "../configs/db.js";
import { refreshTokens } from "../DataBase/Schemas/refreshTokens.js";

export const tokenrepo = {
  
  async saveRefreshToken(token) {
    const [newToken] = await db
      .insert(refreshTokens)
      .values(token)
      .returning();

    return newToken;
  },

  
  async findUserToken(userId) {
    const tokens = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId));

    return tokens;
  },

  
  async findAllActiveTokens(userId) {
    const tokens = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.userId, userId),
          eq(refreshTokens.isRevoked, false)
        )
      );

    return tokens;
  },

  
  async revokedTokens(id) {
    const [revokedToken] = await db
      .update(refreshTokens)
      .set({
        isRevoked: true,
      })
      .where(eq(refreshTokens.id, id))
      .returning();

    return revokedToken;
  },

  
  async deleteToken(id) {
    const [deletedToken] = await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.id, id))
      .returning();

    return deletedToken;
  },

  
  async revokeAllUserToken(userId) {
    const revokedTokens = await db
      .update(refreshTokens)
      .set({
        isRevoked: true,
      })
      .where(eq(refreshTokens.userId, userId))
      .returning();

    return revokedTokens;
  },
  async findByTokenHash( tokenHash) {
  const tokens = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, tokenHash));

  return tokens[0];
}
};