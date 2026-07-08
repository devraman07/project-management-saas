export const createOrgTransformer = (body) => {
  return {
    name: body.name?.trim(),
  };
};