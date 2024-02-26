- - Stack: Node JS/ Express / TypeORM / SQLite3
- API:
   - Sign UP: `/api/accounts/register`
   - Sign IN: `/api/accounts/login`
   - Logout: `/api/accounts/logout`
   - Check Session: `/api/accounts/checkSession`
   - Edit Account: `/api/accounts/edit`
- Data persistence
  - TypeORM / SQLite3
  - Db migrations are in `src/migrations` folder
  - Added new config `ormconfig.json`