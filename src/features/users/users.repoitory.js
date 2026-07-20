import { eq } from "drizzle-orm";

import { db } from "../../configs/db.js";
import { users } from "../../DataBase/Schemas/users.js";

export const userrepo = {
  async findByEmail(email) {
    const user = await db.select().from(users).where(eq(users.email, email));

    return user[0];
  },

  async findById(id) {
    const user = await db.select().from(users).where(eq(users.id, id));

    return user[0];
  },

  async findAll() {
    return await db.select().from(users);
  },

  async create(userData) {
    const [newUser] = await db.insert(users).values(userData).returning();

    return newUser;
  },
  async findByUsername(tx = db, username) {
        const [user] = tx.select().from(users).where(eq(users.username, username));

        return user;
  },

  async update(id, updateData) {
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  },

  async delete(id) {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return deletedUser;
  },
};
