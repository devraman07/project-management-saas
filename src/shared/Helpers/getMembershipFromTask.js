import { AuthorizationError } from "../../errors/AuthorizationError";
import { NotFoundError } from "../../errors/NotFoundError.js";
import { membershipRepo } from "../../features/memberships/membership.repository.js";
import { ProjectRepo } from "../../features/projects/project.repository.js";
import { taskRepo } from "../../features/tasks/task.repository.js"



export const getTaskFromMembership = async(userId, taskId) => {
   const task = await taskRepo.findById(undefined, taskId);

   if(!task) {
    throw new NotFoundError("task not found");
   }

   const project = await ProjectRepo.findById(undefined, task.projectId);

   if(!project) {
    throw new NotFoundError("project not found");
   }

   const membership = await membershipRepo.findAllByUserAndOrg(
    undefined, userId, project.organizationId
   );

   if(!membership) {
    throw new AuthorizationError("not a member of this organization");
   }

   return {
    membership,
    project,
    task
   }
}