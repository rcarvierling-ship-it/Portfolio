
const { createTables } = require('../src/lib/setup-db');
require('dotenv').config({ path: '.env.local' });

(async () => {
    await createTables();
})();
