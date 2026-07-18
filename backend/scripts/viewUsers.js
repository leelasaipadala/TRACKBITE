const mongoose = require('mongoose');
const User = require('../src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/diet-planner');
    const users = await User.find({}, { password: 0 }).lean();
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Failed to fetch users:', error.message);
  } finally {
    await mongoose.disconnect();
  }
})();
