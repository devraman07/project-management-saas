import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { createCommentService,  deletecommentService,  getCommentsByTaskService, updatecommentService } from "./comments.service.js";



export const createCommentController = asyncHandler(async(req, res) => {
    const {taskId} = req.params;

    const result = await createCommentService(taskId, req.body, req.user.id);

    return res.status(result.statusCode).json({
        success : result.success,
        message : result.message,
        comment : result.comment
    });
});


export const getcommentsByTaskController = asyncHandler(async(req, res) => {
      const {taskId} = req.params;
      

      const result = await getCommentsByTaskService(taskId, req.user.id);

      return res.status(result.statusCode).json({
        success : result.success,
        comments : result.comments,
        message : result.message,
      })
});


export const updatecommentController = asyncHandler(async(req, res) => {
    const {taskId, commentId} = req.params;
    
    const {content} = req.body;

    const result = await updatecommentService(req.user.id, taskId, content, commentId);

    return res.status(result.statusCode).json({
        success : result.success,
       comment : result.comment,
       message : result.message,
    })
});

export const deletecommentController = asyncHandler(async(req, res) => {
    const {taskId, commentId} = req.params;
    console.log(commentId);

    const result = await deletecommentService(req.user.id, taskId, commentId);

    return res.status(result.statusCode).json({
        success : result.success,
        message : result.message
    })
});