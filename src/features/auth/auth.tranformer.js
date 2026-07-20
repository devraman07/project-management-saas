export const registerTransformer = (req, res, next) => {
  if (req.body.name) {
    req.body.name = req.body.name.trim();
  }

  if (req.body.email) {
    req.body.email = req.body.email.trim().toLowerCase();
  }

  if (req.body.username) {
    req.body.username = req.body.username.trim().toLowerCase();
  }

  next();
};

export const loginTransformer = (req, res, next) => {
  if (req.body.email) {
    req.body.email = req.body.email.trim().toLowerCase();
  }

  next();
};
