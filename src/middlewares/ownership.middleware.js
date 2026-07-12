import { AuthorizationError } from "../errors/AuthorizationError.js";

export const ownerShipCheck = (req , res , next) => {
    try {
        
        const currUserId = req.user.id;
        const targetUserId = req.params.id;

        if(currUserId !== targetUserId) {
            throw new AuthorizationError("you can only access your own account");
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "ownership check failed"
        })
    }
}