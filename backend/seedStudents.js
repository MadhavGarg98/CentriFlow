const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const sampleStudents = [
  {
    name: 'John Smith',
    email: 'john.smith@student.com',
    password: 'password123',
    role: 'student'
  },
  {
    name: 'Emily Johnson',
    email: 'emily.johnson@student.com',
    password: 'password123',
    role: 'student'
  },
  {
    name: 'Michael Brown',
    email: 'michael.brown@student.com',
    password: 'password123',
    role: 'student'
  },
  {
    name: 'Sarah Davis',
    email: 'sarah.davis@student.com',
    password: 'password123',
    role: 'student'
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@student.com',
    password: 'password123',
    role: 'student'
  }
];

const seedStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing students (optional)
    await User.deleteMany({ role: 'student' });
    console.log('Cleared existing students');

    // Hash passwords and create students
    const salt = await bcrypt.genSalt(12);
    const studentsWithHashedPasswords = sampleStudents.map(student => ({
      ...student,
      password: bcrypt.hashSync(student.password, salt)
    }));

    await User.insertMany(studentsWithHashedPasswords);
    console.log('Sample students created successfully');

    const students = await User.find({ role: 'student' }).select('-password');
    console.log(`Created ${students.length} students:`);
    students.forEach(student => {
      console.log(`- ${student.name} (${student.email})`);
    });

  } catch (error) {
    console.error('Error seeding students:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedStudents();
