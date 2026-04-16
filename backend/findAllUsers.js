const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const findAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find ALL users in the database
    const allUsers = await User.find({}).select('-password');
    console.log(`\nTotal users in database: ${allUsers.length}`);
    
    console.log('\n=== COMPLETE USER LIST ===');
    allUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   ID: ${user._id}`);
    });

    // Specifically search for the email from your screenshot
    const chitkaraUser = await User.findOne({ email: 'chitkarauniversity@gmail.com' }).select('-password');
    console.log('\n=== SEARCHING FOR chitkarauniversity@gmail.com ===');
    if (chitkaraUser) {
      console.log('Found user:');
      console.log(`- Name: ${chitkaraUser.name}`);
      console.log(`- Email: ${chitkaraUser.email}`);
      console.log(`- Role: ${chitkaraUser.role}`);
      console.log(`- Active: ${chitkaraUser.isActive}`);
    } else {
      console.log('User with email chitkarauniversity@gmail.com not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

findAllUsers();
