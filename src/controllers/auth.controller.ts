import {  Request, Response } from 'express';
import {
    getGithubOathToken,
    getGithubUser,
  } from '../services/session.service';
import { createAccountWithToken } from '../services/account.service';

export const githubOauthHandler = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const code = req.query.code as string;
  
      if (!code) {
        return res.json({error: 'authorization code not provided'})
      }
  
      // Get access_token using code
      const { access_token } = await getGithubOathToken({ code });
  
      // Get user details using access token
      const accountData = await getGithubUser({access_token});

      const returnedAccount = await createAccountWithToken(accountData)
      
      res.json({account: returnedAccount})
      
    } catch (err: any) {
      res.json({'error': err.message})
    }
  };
  