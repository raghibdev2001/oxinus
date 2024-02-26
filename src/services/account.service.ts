import jwt from "jsonwebtoken";
import Account from "../models/account";
import ActiveSession from "../models/activeSession";
import { connection } from "../server/database";

export const createAccountWithToken = async (accountData: any) => {

  //Get Repository Connections
  const accountRepository = connection!.getRepository(Account);
  const activeSessionRepository = connection!.getRepository(ActiveSession);

  const { email } = accountData;
  let requiredAccount: any = null;

  //Checked the email exists
  const account = await accountRepository.findOne({ email });

  
  if (account) {
    requiredAccount = account;
  } else {
    const query = {
      email,
    };
    const a = await accountRepository.save(query)
    requiredAccount = a;
  }

  if (!process.env.SECRET) {
    throw new Error("SECRET not provided");
  }

  if (requiredAccount) {
    const token: any = jwt.sign(
      {
        id: requiredAccount.id,
        username: requiredAccount.email,
      },
      process.env.SECRET,
      {
        expiresIn: "1d", // 1 week
      }
    );
    const query = { accountId: requiredAccount.id, token };
    activeSessionRepository.save(query);
    requiredAccount.token = token;
  }
  return requiredAccount;
};
