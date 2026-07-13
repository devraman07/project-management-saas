import { db } from "../configs/db.js"
import { taskRepo } from "../features/tasks/task.repository.js"


export const assignTaskTransactions = async(taskId, membershipId ) => {
    return db.transaction(async(tx) => {
        const updatedTask = await taskRepo.assign(tx, taskId, membershipId);

        return {
            task : updatedTask,
        };
    });
}