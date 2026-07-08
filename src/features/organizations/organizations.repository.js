import { and, eq, ne } from "drizzle-orm";
import { db } from "../../DataBase/db.js";
import { organizations } from "../../DataBase/Schemas/organizations.js";

export const organizationRepo = {
  async create(executor = db, organizationData) {
    const [newOrg] = await executor
      .insert(organizations)
      .values(organizationData)
      .returning();

    return newOrg;
  },

  

  async findById(executor = db, id) {
    const org = await executor
      .select()
      .from(organizations)
      .where(eq(organizations.id, id));

    return org[0];
  },

  async findByNameAndCreator(executor = db, name, createdBy) {
    const organization = await executor
      .select()
      .from(organizations)
      .where(
        and(
          eq(organizations.name, name),
          eq(organizations.createdBy, createdBy)
        )
      );

    return organization[0];
  },

  async findAllByCreator(executor = db, createdBy) {
    const allOrgs = await executor
      .select()
      .from(organizations)
      .where(eq(organizations.createdBy, createdBy));

    return allOrgs;
  },

  async softDelete(executor = db, id) {
  const [deletedOrg] = await executor
    .update(organizations)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
    })
    .where(eq(organizations.id, id))
    .returning();

  return deletedOrg;
},

  async findDuplicateForUpdate (executor = db, orgid, name, createdBy)  {
       const duplicate = await  executor.select().from(organizations).where(
        and(
          eq(organizations.name, name),
          eq(organizations.createdBy, createdBy),
          ne(organizations.id, orgid)
        )
       )

       return duplicate[0];
  },

  async update(executor = db, id, organizationData) {
  const [updatedOrg] = await executor
    .update(organizations)
    .set({
      name: organizationData.name,
    })
    .where(eq(organizations.id, id))
    .returning();

  return updatedOrg;
}
  
};