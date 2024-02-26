/*
Developed by Raghib Khesal for Oxinus Test
*/

import 'dotenv/config';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import initPassport from '../config/passport';
import routes from '../routes/accounts';
import sessionRoute from '../routes/session.route'
import { connect } from './database';

// Instantiate express
const server = express();
server.use(compression());

// Passport Config
initPassport(passport);
server.use(passport.initialize());

// Connect to sqlite
if (process.env.NODE_ENV !== 'test') {
  connect();
}

//Use for Cross Origin
server.use(cors());
server.use(express.json());

// Initialize routes middleware
server.use('/api/accounts', routes);
server.use('/api/sessions', sessionRoute)

export default server;
