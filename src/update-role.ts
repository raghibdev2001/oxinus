import "dotenv/config";
import Account from "./models/account";
import { connection, connect } from "./server/database";
const accountId = process.argv[2];
const accountBirthday = process.argv[3] ?? "1";

const updateAccount = async () => {
  await connect();
  const accountRepository = connection!.getRepository(Account);
  accountRepository.find({ id: accountId }).then((account: any) => {
    if (!account.length) {
      console.error( "No user exists with the given id" )
      return;
    }
    const query = { id: account[0].id };
    const newValues = { birthday: accountBirthday };
    accountRepository
      .update(query, newValues)
      .then(() => console.log(`Account updated successfully with role ${newValues.birthday}`)
      )
      .catch((err) => console.error(`error in updating account: ${err.message}`)
      );
  })
  .catch((err) =>  console.log(`error: ${err.message}`)
  )
};

updateAccount();
