const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const seedFaculty = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create faculty user
    const facultyData = {
      name: 'Professor Anderson',
      email: 'faculty@centriflow.com',
      password: 'faculty123',
      role: 'faculty'
    };

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(facultyData.password, salt);

    const faculty = new User({
      ...facultyData,
      password: hashedPassword
    });

    await faculty.save();
    console.log('Faculty user created successfully');
    console.log(`Email: ${facultyData.email}`);
    console.log(`Password: ${facultyData.password}`);

  } catch (error) {
    console.error('Error seeding faculty:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedFaculty();
