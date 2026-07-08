// GET /invites/:token
// POST /invites/:token/accept
// PATCH /invites/:inviteId/revoke
// POST /invites/:inviteId/resend

import express from 'express';
import { acceptInviteController, getInviteByTokenController } from './invites.controller.js';
import { authMiddleware } from '../../middlewares/auth.middileware.js';

export const inviteRouter = express.Router();


inviteRouter.get("/:token", getInviteByTokenController);
inviteRouter.post("/:token/accept", authMiddleware, acceptInviteController);
