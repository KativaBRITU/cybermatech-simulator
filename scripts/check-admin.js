const path = require('path');
const { createDatabase } = require('../modules/database');
(async () => {
  const db = await createDatabase(path.join(__dirname, '..', 'database'));
  const cols = await db.allAsync("PRAGMA table_info(users)");
  console.log('users table columns:');
  console.table(cols.map(c => ({ name: c.name, type: c.type })));
  const users = await db.allAsync("SELECT id, username, email FROM users ORDER BY id");
  console.log('\nAll users:');
  console.table(users);
  process.exit(0);
})();
