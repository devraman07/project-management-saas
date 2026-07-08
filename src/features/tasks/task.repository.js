import { and, eq } from "drizzle-orm";
import { db } from "../../DataBase/db.js";
import { tasks } from "../../DataBase/Schemas/tasks.js";

export const taskRepo = {
  async create(executor = db, taskData) {
    const [newTask] = await executor.insert(tasks).values(taskData).returning();

    return newTask;
  },

  async findAllByProject(executor = db, projectId) {
    const allTasks = await executor
      .select()
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.isArchived, false)));

    return allTasks;
  },
  async findById(executor = db, taskId) {
    const task = await executor
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId));

    return task[0];
  },
  async update(executor = db, taskId, updateData) {
    const [updatedTask] = await executor
      .update(tasks)
      .set({
        title: updateData.title,
        description: updateData.description,
        priority: updateData.priority,
        dueDate: updateData.dueDate,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    return updatedTask;
  },
  async updateStatus(executor = db, taskId, status) {
    const [updatedTask] = await executor
      .update(tasks)
      .set({ status })
      .where(eq(tasks.id, taskId))
      .returning();

    return updatedTask;
  },

  async assign(executor = db, taskId, membershipId) {
    const [updatedTask] = await executor
      .update(tasks)
      .set({
        assignedTo: membershipId,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    return updatedTask;
  },
  async softDelete(executor = db, taskId) {
    const [deletedTask] = await executor
      .update(tasks)
      .set({
        isArchived: true,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    return deletedTask;
  },
};
