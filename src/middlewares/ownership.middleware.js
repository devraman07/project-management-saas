export const ownerShipCheck = (req , res , next) => {
    try {
        
        const currUserId = req.user.id;
        const targetUserId = req.params.id;

        if(currUserId !== targetUserId) {
            return res.status(403).json({
                success : false,
                message : "you can only access your own account",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "ownership check failed"
        })
    }
}