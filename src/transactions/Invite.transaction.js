import { db } from "../configs/db.js";
import { InviteRepo } from "../features/Invites/invites.reposiory.js";
import { membershipRepo } from "../features/memberships/membership.repository.js";


export const acceptInviteTransacion = async ({
    invite , user
}) => {
    return db.transaction(async(tx) => {
        const membership = await membershipRepo.createMembership(tx, 
            {
                userId : user.id,
                organizationId : invite.organizationId,
                role : invite.roleToAssign,
                invitedBy : invite.invitedBy,
            }
        );

        const updatedInvite  = await InviteRepo.updateStatus(
            tx,
            invite.id,
            "ACCEPTED"
        );
        return {
            membership,
            invite : updatedInvite,
        };

    });
}