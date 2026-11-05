const mongoose = require('mongoose');
const User = require('./DB/model/user.model');
const config = require('./config/env');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(async () => {
  try {
    const existing = await User.findOne({ email: 'superadmin@example.com' });
    if (!existing) {
      await User.create({
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: 'password123',
        role: 'SUPER_ADMIN',
        status: 'Active'
      });
      console.log('Super Admin seeded successfully! Email: superadmin@example.com, Password: password123');
    } else {
      console.log('Super Admin already exists.');
    }
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    process.exit(0);
  }
}).catch(err => {
  console.error('DB Connection Error:', err);
  process.exit(1);
});
