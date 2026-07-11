import { activityQueue } from "../../../jobs/queues/activity.queue.js"




export const logActivity = async (activity) => {
   
    await activityQueue.add(
        "activity-log", 
        activity
    )
}