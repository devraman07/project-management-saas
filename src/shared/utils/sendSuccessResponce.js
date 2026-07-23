


export const sendSuccessResponse = (res, result) => {
    return res.status(result.statusCode).json({
        success : result.success,
        data : result.data,
        message : result.message,
    })
}