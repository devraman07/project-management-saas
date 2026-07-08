

export const updateUserTransformer = (req, res , next) => {
    if(req.body.name) {
        req.body.name = req.body.name
        .trim().replace(/\s+/g, " ");
    }

    if(req.body.email) {
        req.body.email = req.body.email.trim().toLowerCase();
    }


    next();
}