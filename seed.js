require('dotenv').config();
const { Sequelize, Op } = require('sequelize');
const { User, Issue } = require('./src/models');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log
  }
);

function getFormattedDate(date) {
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

async function clearDatabase() {
  try {
    await sequelize.query('SET session_replication_role = replica;');
    await Issue.drop();
    await User.drop();
    await sequelize.query('SET session_replication_role = DEFAULT;');
    console.log('Database cleared successfully');
  } catch (error) {
    console.log('Database was already empty or could not be cleared:', error.message);
  }
}

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    await clearDatabase();
    await sequelize.sync();
    console.log('Database tables created!');

    // Create users with findOrCreate to avoid duplicates
    const [adminUser] = await User.findOrCreate({
      where: { discordId: '1234567890' },
      defaults: {
        username: 'admin',
        discriminator: '0001',
        email: 'admin@issuetracker.com',
        password: 'admin123',
        isAdmin: true,
        avatar: 'https://cdn.discordapp.com/avatars/1234567890/admin.png'
      }
    });

    const [regularUser] = await User.findOrCreate({
      where: { discordId: '9876543210' },
      defaults: {
        username: 'testuser',
        discriminator: '1234',
        email: 'user@test.com',
        password: 'user123',
        isAdmin: false,
        avatar: 'https://cdn.discordapp.com/avatars/9876543210/user.png'
      }
    });
    console.log('Users created/verified successfully');

// Create timestamps for our seeded data
const now = Date.now();
const twoHoursAgo = now - (2 * 60 * 60 * 1000);
const oneHourAgo = now - (60 * 60 * 1000);
const ninetyMinutesAgo = now - (90 * 60 * 1000);

// Create main issues first
const mainIssue1 = await Issue.create({
  id: twoHoursAgo,
  issue_id: twoHoursAgo, // Same as id for main issues
  username: 'bug_reporter',
  date: getFormattedDate(new Date(twoHoursAgo)),
  comment: 'The bot is not responding to commands in #general channel',
  comment_media: 'https://cdn.discordapp.com/attachments/123/456/error.png',
  status: 'Open'
});

const mainIssue2 = await Issue.create({
  id: oneHourAgo,
  issue_id: oneHourAgo,
  username: 'feature_requester',
  date: getFormattedDate(new Date(oneHourAgo)),
  comment: 'Can we add a command to search previous issues?',
  status: 'Open'
});

const mainIssue3 = await Issue.create({
  id: ninetyMinutesAgo,
  issue_id: ninetyMinutesAgo,
  username: 'community_member',
  date: getFormattedDate(new Date(ninetyMinutesAgo)),
  comment: 'How do I use the help command?',
  comment_media: 'https://cdn.discordapp.com/attachments/123/789/help.png',
  status: 'Resolved'
});
console.log('Main issues created successfully');

// Create replies (comments)
await Promise.all([
  // Replies to mainIssue1
  Issue.create({
    id: twoHoursAgo + 300000, // 5 minutes later
    issue_id: mainIssue1.id, // Reference original issue
    username: 'support_team',
    date: getFormattedDate(new Date(twoHoursAgo + 300000)),
    comment: 'Looking into this now',
    reply_to: mainIssue1.id,
    status: 'NA'
  }),
  Issue.create({
    id: twoHoursAgo + 900000, // 15 minutes later
    issue_id: mainIssue1.id,
    username: 'support_team',
    date: getFormattedDate(new Date(twoHoursAgo + 900000)),
    comment: 'Found the issue - the bot lacked permissions. Fixed now!',
    reply_to: mainIssue1.id,
    status: 'NA',
    is_pinned: true
  }),

  // Reply to mainIssue3
  Issue.create({
    id: ninetyMinutesAgo + 600000, // 10 minutes later
    issue_id: mainIssue3.id,
    username: 'support_bot',
    date: getFormattedDate(new Date(ninetyMinutesAgo + 600000)),
    comment: 'You can use !help to see all available commands',
    reply_to: mainIssue3.id,
    status: 'NA',
    is_pinned: true
  })
]);
console.log('Replies created successfully');

console.log(`
Seeding completed! Here are the test issue IDs:
- Main Issue 1 (Bug Report): ${mainIssue1.id}
- Main Issue 2 (Feature Request): ${mainIssue2.id}
- Main Issue 3 (Help Question): ${mainIssue3.id}
`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();