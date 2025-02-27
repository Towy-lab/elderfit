/**
 * Simplified email service
 * In production, you would connect to a real email service
 */

function sendWelcomeEmail(email, data) {
    // In a real app, connect to SendGrid, Mailchimp, etc.
    console.log(`Sending welcome email to ${email}`, data);
    return Promise.resolve(true);
  }
  
  function sendUpgradeEmail(email, data) {
    console.log(`Sending upgrade email to ${email}`, data);
    return Promise.resolve(true);
  }
  
  module.exports = {
    sendWelcomeEmail,
    sendUpgradeEmail
  };