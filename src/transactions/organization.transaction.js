import { db } from "../configs/db.js"
import { conflictError } from "../errors/conflictError.js";
import { membershipRepo } from "../features/memberships/membership.repository.js";
import { organizationRepo } from "../features/organizations/organizations.repository.js"


export const createOrganizationTransaction = async (organizationData, user) => {
    return db.transaction(async (tx) => {

        const existingOrg = await organizationRepo.findByNameAndCreator(
            tx,
            organizationData.name,
            user.id,
        );

        if (existingOrg) {
            throw new conflictError("organization already exists");
        }

        const organization = await organizationRepo.create(tx, {
            name: organizationData.name,
            createdBy: user.id,
        });

        const ownerMembership = await membershipRepo.createMembership(
            tx,
            {
                userId: user.id,
                organizationId: organization.id,
                role: "OWNER",
                status: "ACTIVE",
                invitedBy: null,
            }
        );

        return {
            organization,
            ownerMembership,
        };
    });
};