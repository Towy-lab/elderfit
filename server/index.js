const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Only use raw for webhook route
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// Routes
try {
  app.use('/api', require('./routes/stripe'));
} catch (error) {
  console.warn('Warning: Stripe routes not fully configured yet.', error.message);
}

try {
  app.use('/api', require('./routes/subscription'));
} catch (error) {
  console.warn('Warning: Subscription routes not fully configured yet.', error.message);
}

// Simple route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});