//psql -U your_username -d discord_issue_tracker -c "SELECT id, email, discordId, password FROM \"Users\";"
// copy the hash for your selected user into the dbHash value below

require('dotenv').config();
const bcrypt = require('bcrypt');

async function test() {
  const plain = 'admin123';
  const hash = await bcrypt.hash(plain, 10);
  //console.log('Generated hash:', hash);
  
  const match = await bcrypt.compare(plain, hash);
  console.log('Should be true:', match);
  
  const dbHash = 'YOUR_HASH_HERE'; 
  const dbMatch = await bcrypt.compare(plain, dbHash);
  //console.log('Database Hash:', dbHash)
  console.log('Database hash match:', dbMatch);
}

test();