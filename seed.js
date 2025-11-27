require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');

async function seed() {
  await sequelize.sync();
  const adminEmail = 'admin@example.com';
  const existing = await User.findOne({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin already exists:', adminEmail);
    process.exit(0);
  }
  const hash = await bcrypt.hash('Admin123!', 10);
  await User.create({
    name: 'Admin',
    email: adminEmail,
    passwordHash: hash,
    role: 'admin'
  });
  console.log('Created admin ->', adminEmail, 'password: Admin123!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
