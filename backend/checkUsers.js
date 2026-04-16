const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const allUsers = await User.find({}).select('-password');
    console.log(`\nTotal users in database: ${allUsers.length}`);
    
    console.log('\n=== ALL USERS ===');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Check specifically for Madhav
    const madhav = await User.findOne({ 
      $or: [
        { name: /madhav/i },
        { email: /madhav/i }
      ]
    }).select('-password');

    console.log('\n=== SEARCH FOR MADHAV ===');
    if (madhav) {
      console.log(`Found Madhav: ${madhav.name} (${madhav.email}) - Role: ${madhav.role}`);
      console.log(`Active: ${madhav.isActive}`);
      console.log(`Created: ${madhav.createdAt}`);
    } else {
      console.log('Madhav not found in database');
    }

    // Check only students
    const students = await User.find({ role: 'student' }).select('-password');
    console.log(`\n=== STUDENTS ONLY (${students.length}) ===`);
    students.forEach(student => {
      console.log(`- ${student.name} (${student.email})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

checkUsers();
