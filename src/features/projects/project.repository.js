import { eq } from "drizzle-orm";
import { db } from "../../DataBase/db.js";
import { projects } from "../../DataBase/Schemas/projects.js";

export const ProjectRepo = {
  async Create(executor = db, projectData) {
    const [newProject] = await executor
      .insert(projects)
      .values(projectData)
      .returning();

    return newProject;
  },

  async findByName(executor = db, name) {
    const exisitngProject = await executor
      .select()
      .from(projects)
      .where(eq(projects.name, name));
    return exisitngProject[0];
  },
  async findAllByOrganization(executor = db, organizationId) {
    const allProjects = await executor
      .select()
      .from(projects)
      .where(eq(projects.organizationId, organizationId));

    return allProjects;
  },

  async findById(executor = db, projectId) {
    const project = await executor
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));

    return project[0];
  },

  async update(executor = db, projectId, updateData) {
    const [updatedProject] = await executor
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, projectId))
      .returning();

    return updatedProject;
  },
  async updateStatus(executor = db, projectId, status) {
    const [updatedProject] = await executor
      .update(projects)
      .set({ status })
      .where(eq(projects.id, projectId))
      .returning();

    return updatedProject;
  },

  async softDelete(executor = db, projectId) {
    const [archivedProject] = await executor.update(projects).set({
        isArchived : true,
    }).where(
        eq(projects.id, projectId)
    ).returning();

    return archivedProject;
  }

};
