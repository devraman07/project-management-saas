import { db } from "../../DataBase/db.js"
import { membershipRepo } from "../memberships/membership.repository.js";
import { organizationRepo } from "./organizations.repository.js"


export const createOrganizationTransaction = async (organizationData, user) => {
    return await db.transaction(async (tx) => {

        const existingOrganizations = await organizationRepo.findByNameAndCreator(
            tx,
            organizationData.name,
            user.id
        );

        if(existingOrganizations) {
            throw new Error("Organization already exists");
        }

        const newOrganization = await organizationRepo.create(tx,
            {
                name : organizationData.name,
                createdBy : user.id,
            }
        );

        await membershipRepo.createMembership(
            tx,
            {
                userId : user.id,
                organizationId : newOrganization.id,
                role : "OWNER",
                status : "ACTIVE",
                invitedBy : null,
            }
        );

        return newOrganization;
    })
}