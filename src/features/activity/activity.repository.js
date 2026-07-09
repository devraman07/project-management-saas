import { desc, eq } from "drizzle-orm";
import { db } from "../../configs/db.js";
import { activityLogs } from "../../DataBase/Schemas/activity_logs.js";




export const activityRepository = {

    async create(tx = db, data) {
        const [newActivity] = await tx.insert(activityLogs).values(data).returning();

        return newActivity;
    },

    async findByOrganization(tx = db, organizationId) {
        const activities =  await tx.select().from(activityLogs).where(
            eq(activityLogs.organizationId, organizationId)
        ).orderBy(desc(activityLogs.createdAt));
        
        return activities;
    },

    async findByEntity(tx= db, entityId) {
         const activities = await tx.select().from(activityLogs).where(
            eq(activityLogs.entityId, entityId)
         ).orderBy(desc(activityLogs.createdAt));

         return activities;
    },


}