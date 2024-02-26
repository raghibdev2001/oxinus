/*
Developed by Raghib Khesal for Oxinus Test
*/

import bcrypt from 'bcrypt';
import express from 'express';
import DateExtension from '@joi/date';
import * as Joi from 'joi';
import jwt from 'jsonwebtoken';
import { checkToken } from '../config/safeRoutes';
import ActiveSession from '../models/activeSession';
import Account from '../models/account';
import { connection } from '../server/database';
import { logoutUser } from '../controllers/logout.controller';


//---------------------------------
//Use JOI Validation schema
//---------------------------------
const accountSchema = Joi.object().keys({  
  firstname: Joi.string().alphanum().max(100).required(),
  lastname: Joi.string().alphanum().max(100).required(),
  email: Joi.string().email().max(100).required(),
  phone: Joi.string().alphanum().max(16).required(),  
  password: Joi.string().max(50).required(),
  birthday: Joi.extend(DateExtension).date().format(['YYYY-MM-DD']).required(),
});

const accountLoginSchema = Joi.object().keys({
  email: Joi.string().email().max(100).required(),  
  password: Joi.string().max(50).required(),
});

const updateAccountSchema = Joi.object().keys({
  accountID: Joi.required(),
  firstname: Joi.string().alphanum().max(100).optional(),
  lastname: Joi.string().alphanum().max(100).optional(),
  phone: Joi.string().alphanum().max(16).optional(),  
  password: Joi.string().max(50).optional(),
});
//---------------------------------
// End Use JOI Validation schema
//---------------------------------


//---------------------------------
// Route start
//---------------------------------
const router = express.Router();
router.post('/register', (req, res) => {
  // Joi Validation
  const result = accountSchema.validate(req.body);
  if (result.error) {
    res.status(422).json({
      success: false,
      msg: `Validation err: ${result.error.details[0].message}`,
    });
    return;
  }

  const { firstname, lastname, email, phone, password, birthday } = req.body;
  const accountRepository = connection!.getRepository(Account);
  accountRepository.findOne({ email }).then((account) => {
    if (account) {
      res.json({ success: false, msg: 'Email already exists' });
    } else {
      bcrypt.genSalt(10, (_err, salt) => {
        bcrypt.hash(password, salt).then((hash) => {
          const query = {
            firstname,
            lastname,
            email,
            phone,
            password: hash,
            birthday,
          };

          accountRepository.save(query).then((a) => {
            res.json({ success: true, accountID: a.id, msg: 'The account was successfully registered' });
          });
        });
      });
    }
  });
});



router.post('/login', (req, res) => {
  // Joi Validation
  const result = accountLoginSchema.validate(req.body);
  if (result.error) {
    res.status(422).json({
      success: false,
      msg: `Validation err: ${result.error.details[0].message}`,
    });
    return;
  }

  const { email } = req.body;
  const { password } = req.body;
  const accountRepository = connection!.getRepository(Account);
  const activeSessionRepository = connection!.getRepository(ActiveSession);

  accountRepository.findOne({ email }).then((account) => {
    if (!account) {
      return res.json({ success: false, msg: 'Credentials are wrong' });
    }

    if (!account.password) {
      return res.json({ success: false, msg: 'Please enter password' });
    }

    bcrypt.compare(password, account.password, (_err2, isMatch) => {
      if (isMatch) {
        if (!process.env.SECRET) {
          throw new Error('Please provide secret');
        }

        const token = jwt.sign({
          id: account.id,
          email: account.email,
        }, process.env.SECRET, {
          expiresIn: "1d", // 1 day
        });

        const query = { accountId: account.id, token };

        activeSessionRepository.save(query);
        (account as { password: string | undefined }).password = undefined;
        return res.json({
          success: true,
          token,
          account,
        });
      }
      return res.json({ success: false, msg: 'Credentials are wrong' });
    });
  });
});


router.post('/logout', checkToken, logoutUser);


router.post('/checkSession', checkToken, (_req, res) => {
  res.json({ success: true });
});


router.post('/all', checkToken, (_req, res) => {
  const accountRepository = connection!.getRepository(Account);
  accountRepository.find({}).then((accounts) => {
    accounts = accounts.map((item) => {
      const x = item;
      (x as { password: string | undefined }).password = undefined;
      return x;
    });
    res.json({ success: true, accounts });
  }).catch(() => res.json({ success: false }));
});



router.post('/edit', checkToken, (req, res) => {
  // Joi Validation
  const result = updateAccountSchema.validate(req.body);
  if (result.error) {
    res.status(422).json({
      success: false,
      msg: `Validation err: ${result.error.details[0].message}`,
    });
    return;
  }

  const { accountID, firstname, lastname, birthday } = req.body;
  const accountRepository = connection!.getRepository(Account);
  accountRepository.find({ id: accountID }).then((account) => {
    if (account.length === 1) {
      const query = { id: account[0].id };
      const newvalues = { firstname, lastname, birthday };
      accountRepository.update(query, newvalues).then(
        () => {
          res.json({ success: true });
        },
      ).catch(() => {
        res.json({ success: false, msg: 'There was an error. Please contract the administrator' });
      });
    } else {
      res.json({ success: false, msg: 'Error updating user' });
    }
  });
});



// Used for non functional process test - Server
router.get('/nonfunctionalprocesstest', (_req, res) => {
  res.status(200).json({ success: true, msg: 'all good' });
});
//---------------------------------
// Route start
//---------------------------------


export default router;
