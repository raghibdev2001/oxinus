/*
Developed by Raghib Khesal for Oxinus Test
*/

import { NextFunction, Request, Response } from 'express';

import ActiveSession from '../models/activeSession';
import { connection } from '../server/database';

// eslint-disable-next-line import/prefer-default-export
export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = String(req.headers.authorization || req.body.token);
  const activeSessionRepository = connection!.getRepository(ActiveSession);
  activeSessionRepository.find({ token }).then((session) => {

    if (session.length === 1) {
      return next();
    }
    return res.json({ success: false, msg: 'Account is not logged on' });
  });
};
