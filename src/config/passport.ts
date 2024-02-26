/*
Developed by Raghib Khesal for Oxinus Test
*/

import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import Account from '../models/account';
import { connection } from '../server/database';

export default (pass: passport.PassportStatic) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.SECRET,
  };

  pass.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        const accountRepository = connection?.getRepository(Account);
        const account = await accountRepository?.findOne(jwtPayload._doc._id);

        if (account) {
          return done(null, account);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }),
  );
};
