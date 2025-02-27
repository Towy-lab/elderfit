// This is a simplified model stub for demonstration
// In a real app, you'd use a database like MongoDB with Mongoose

const users = [];

class User {
  static findById(id) {
    return users.find(user => user.id === id);
  }
  
  static findOne(query) {
    if (query.stripeCustomerId) {
      return users.find(user => user.stripeCustomerId === query.stripeCustomerId);
    }
    if (query.email) {
      return users.find(user => user.email === query.email);
    }
    return null;
  }
  
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.email = data.email;
    this.name = data.name;
    this.stripeCustomerId = data.stripeCustomerId;
    this.subscription = data.subscription;
  }
  
  save() {
    const existingUserIndex = users.findIndex(user => user.id === this.id);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = this;
    } else {
      users.push(this);
    }
    
    return this;
  }
}

module.exports = User;