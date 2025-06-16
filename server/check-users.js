const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/elderfit', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Delete the test user if it exists
    const deletedUser = await User.findOneAndDelete({ email: 'testing@testing.com' });
    if (deletedUser) {
      console.log('Deleted existing user:', deletedUser.email);
    } else {
      console.log('No existing user found to delete');
    }

    // Then get all users
    const users = await User.find({}).select('-password');
    console.log('\nTotal users in database:', users.length);
    
    // Print user details
    users.forEach(user => {
      console.log('\nUser:', {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        subscription: user.subscription,
        createdAt: user.createdAt
      });
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkUsers(); 