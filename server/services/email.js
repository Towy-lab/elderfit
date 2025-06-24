// server/services/email.js - Enhanced for subscription emails
import nodemailer from 'nodemailer';

// Create reusable transporter
let transporter;

// Initialize transporter based on environment
if (process.env.NODE_ENV === 'production') {
  // Production transporter (e.g., SendGrid, AWS SES)
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
} else {
  // Development transporter (ethereal.email)
  // For testing, create an account at https://ethereal.email/
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.DEV_EMAIL_USER || 'your_ethereal_username',
      pass: process.env.DEV_EMAIL_PASS || 'your_ethereal_password'
    }
  });
}

// Helper function to send email
const sendEmail = async (options) => {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    
    // Log preview URL in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send welcome email after subscription
const sendSubscriptionWelcomeEmail = async (email, { firstName, tier }) => {
  const formattedTier = tier.charAt(0).toUpperCase() + tier.slice(1);
  
  const mailOptions = {
    email,
    subject: `Welcome to ElderFit Secrets ${formattedTier}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4A90E2; text-align: center;">Welcome to ElderFit Secrets ${formattedTier}!</h1>
        
        <p>Hello ${firstName},</p>
        
        <p>Thank you for subscribing to the <strong>${formattedTier}</strong> plan. We're excited to have you join our community of active seniors!</p>
        
        <h2 style="color: #4A90E2;">What's Included in Your ${formattedTier} Plan:</h2>
        
        ${getTierBenefits(tier)}
        
        <div style="background-color: #F5F5F5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Getting Started:</h3>
          <ol>
            <li>Log in to your account at <a href="${process.env.FRONTEND_URL}/login">ElderFit Secrets</a></li>
            <li>Complete your profile with your fitness preferences</li>
            <li>Browse our exercise library tailored for seniors</li>
            <li>Set up your first workout routine</li>
          </ol>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@elderfitsecrets.com">support@elderfitsecrets.com</a>.</p>
        
        <p>Stay active and healthy!</p>
        
        <p>The ElderFit Secrets Team</p>
        
        <hr style="border: 1px solid #EEEEEE; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #888888; text-align: center;">
          You're receiving this email because you subscribed to ElderFit Secrets ${formattedTier} plan.<br />
          ${tier !== 'basic' ? `To manage your subscription, <a href="${process.env.FRONTEND_URL}/subscription/manage">click here</a>.` : ''}
        </p>
      </div>
    `
  };
  
  return await sendEmail(mailOptions);
};

// Send email when subscription is upgraded
const sendSubscriptionUpgradeEmail = async (email, { firstName, tier }) => {
  const formattedTier = tier.charAt(0).toUpperCase() + tier.slice(1);
  
  const mailOptions = {
    email,
    subject: `Your ElderFit Secrets Subscription Upgraded to ${formattedTier}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4A90E2; text-align: center;">Subscription Upgraded!</h1>
        
        <p>Hello ${firstName},</p>
        
        <p>Thank you for upgrading to the <strong>${formattedTier}</strong> plan. You now have access to additional features to enhance your fitness journey!</p>
        
        <h2 style="color: #4A90E2;">New Features You Can Now Access:</h2>
        
        ${getTierBenefits(tier)}
        
        <div style="background-color: #F5F5F5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Try These New Features:</h3>
          <ul>
            <li>Explore the expanded exercise library</li>
            <li>Check out your personalized workout recommendations</li>
            <li>Connect with our community of active seniors</li>
          </ul>
        </div>
        
        <p>Your subscription has been updated automatically, and your account now reflects your new plan benefits.</p>
        
        <p>If you have any questions or need assistance with your new features, please contact our support team at <a href="mailto:support@elderfitsecrets.com">support@elderfitsecrets.com</a>.</p>
        
        <p>Stay active and healthy!</p>
        
        <p>The ElderFit Secrets Team</p>
        
        <hr style="border: 1px solid #EEEEEE; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #888888; text-align: center;">
          You're receiving this email because you upgraded your ElderFit Secrets subscription.<br />
          To manage your subscription, <a href="${process.env.FRONTEND_URL}/subscription/manage">click here</a>.
        </p>
      </div>
    `
  };
  
  return await sendEmail(mailOptions);
};

// Send email when subscription is cancelled
const sendSubscriptionCancellationEmail = async (email, { firstName }) => {
  const mailOptions = {
    email,
    subject: 'Your ElderFit Secrets Subscription Has Been Cancelled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4A90E2; text-align: center;">Subscription Cancelled</h1>
        
        <p>Hello ${firstName},</p>
        
        <p>We're sorry to see you go! Your subscription to ElderFit Secrets has been cancelled as requested.</p>
        
        <div style="background-color: #F5F5F5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">What This Means:</h3>
          <ul>
            <li>You'll continue to have access to your current plan features until the end of your billing period.</li>
            <li>After that, your account will revert to the free Basic tier with limited features.</li>
            <li>Your account and profile information will remain intact.</li>
          </ul>
        </div>
        
        <p>We'd love to know why you decided to cancel. Your feedback helps us improve our service for all members. Please take a moment to <a href="${process.env.FRONTEND_URL}/feedback">share your thoughts</a>.</p>
        
        <p>If you change your mind, you can reactivate your subscription anytime by visiting your <a href="${process.env.FRONTEND_URL}/subscription/manage">subscription management page</a>.</p>
        
        <p>We hope to see you back soon!</p>
        
        <p>The ElderFit Secrets Team</p>
        
        <hr style="border: 1px solid #EEEEEE; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #888888; text-align: center;">
          You're receiving this email because you cancelled your ElderFit Secrets subscription.<br />
          To reactivate your subscription, <a href="${process.env.FRONTEND_URL}/subscription/manage">click here</a>.
        </p>
      </div>
    `
  };
  
  return await sendEmail(mailOptions);
};

// Send email when subscription is reactivated
const sendSubscriptionReactivatedEmail = async (email, { firstName, tier }) => {
  const formattedTier = tier.charAt(0).toUpperCase() + tier.slice(1);
  
  const mailOptions = {
    email,
    subject: 'Your ElderFit Secrets Subscription Has Been Reactivated!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4A90E2; text-align: center;">Welcome Back!</h1>
        
        <p>Hello ${firstName},</p>
        
        <p>Great news! Your <strong>${formattedTier}</strong> subscription to ElderFit Secrets has been successfully reactivated.</p>
        
        <div style="background-color: #F5F5F5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">What This Means:</h3>
          <ul>
            <li>You once again have full access to all ${formattedTier} tier features.</li>
            <li>Your workout history and preferences are still available.</li>
            <li>You can continue your fitness journey right where you left off.</li>
          </ul>
        </div>
        
        <p>We're excited to have you back in our community of active seniors!</p>
        
        <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:support@elderfitsecrets.com">support@elderfitsecrets.com</a>.</p>
        
        <p>Stay active and healthy!</p>
        
        <p>The ElderFit Secrets Team</p>
        
        <hr style="border: 1px solid #EEEEEE; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #888888; text-align: center;">
          You're receiving this email because you reactivated your ElderFit Secrets subscription.<br />
          To manage your subscription, <a href="${process.env.FRONTEND_URL}/subscription/manage">click here</a>.
        </p>
      </div>
    `
  };
  
  return await sendEmail(mailOptions);
};

// Send email when subscription has ended
const sendSubscriptionEndedEmail = async (email, { firstName }) => {
  const mailOptions = {
    email,
    subject: 'Your ElderFit Secrets Subscription Has Ended',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4A90E2; text-align: center;">Subscription Ended</h1>
        
        <p>Hello ${firstName},</p>
        
        <p>Your subscription to ElderFit Secrets has now ended. Your account has been reverted to the free Basic tier.</p>
        
        <div style="background-color: #F5F5F5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">What This Means:</h3>
          <ul>
            <li>You still have access to basic features and workouts.</li>
            <li>Premium features are no longer available.</li>
            <li>Your workout history and account information remain intact.</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/subscription/plans" style="background-color: #4A90E2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reactivate Your Subscription</a>
        </div>
        
        <p>We hope you enjoyed your time with our premium services. If you'd like to share any feedback about your experience, please <a href="${process.env.FRONTEND_URL}/feedback">click here</a>.</p>
        
        <p>Stay active and healthy!</p>
        
        <p>The ElderFit Secrets Team</p>
        
        <hr style="border: 1px solid #EEEEEE; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #888888; text-align: center;">
          You're receiving this email because your ElderFit Secrets subscription has ended.<br />
          To resubscribe, <a href="${process.env.FRONTEND_URL}/subscription/plans">click here</a>.
        </p>
      </div>
    `
  };
  
  return await sendEmail(mailOptions);
};

// Send email when payment fails
const sendPaymentFailedEmail = async (email, { firstName, amount, nextAttemptDate }) => {
  const formattedDate = nextAttemptDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const mailOptions = {
    email,
    subject: 'Action Required: Payment Failed for Your ElderFit Secrets Subscription',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4A90E2; text-align: center;">Payment Failed</h1>
        
        <p>Hello ${firstName},</p>
        
        <p>We were unable to process your payment of <strong>$${amount.toFixed(2)}</strong> for your ElderFit Secrets subscription.</p>
        
        <div style="background-color: #F5F5F5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">What You Need to Know:</h3>
          <ul>
            <li>Your subscription is still active for now.</li>
            <li>We will automatically attempt to charge your payment method again on <strong>${formattedDate}</strong>.</li>
            <li>To avoid service interruption, please update your payment information before the next attempt.</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/subscription/manage" style="background-color: #4A90E2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Update Payment Method</a>
        </div>
        
        <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:support@elderfitsecrets.com">support@elderfitsecrets.com</a>.</p>
        
        <p>Thank you for being a valued member of ElderFit Secrets!</p>
        
        <p>The ElderFit Secrets Team</p>
        
        <hr style="border: 1px solid #EEEEEE; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #888888; text-align: center;">
          You're receiving this email because a payment for your ElderFit Secrets subscription failed.<br />
          To manage your subscription, <a href="${process.env.FRONTEND_URL}/subscription/manage">click here</a>.
        </p>
      </div>
    `
  };
  
  return await sendEmail(mailOptions);
};

// Send email when subscription is downgraded to basic
const sendSubscriptionDowngradeEmail = async (email, { firstName, currentTier, endDate }) => {
  const formattedDate = endDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTier = currentTier.charAt(0).toUpperCase() + currentTier.slice(1);
  
  const mailOptions = {
    email,
    subject: 'Your ElderFit Secrets Subscription Will Be Downgraded to Basic',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4A90E2; text-align: center;">Subscription Change</h1>
        
        <p>Hello ${firstName},</p>
        
        <p>We've processed your request to downgrade from the <strong>${formattedTier}</strong> plan to the <strong>Basic</strong> free plan.</p>
        
        <div style="background-color: #F5F5F5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">What You Need to Know:</h3>
          <ul>
            <li>You'll continue to have access to all your <strong>${formattedTier}</strong> plan features until <strong>${formattedDate}</strong>.</li>
            <li>After that date, your account will automatically switch to the free Basic plan.</li>
            <li>Your account information, workout history, and progress data will remain intact.</li>
          </ul>
        </div>
        
        <p>We want to make this transition as smooth as possible. If you have any questions about what features will be available in your Basic plan, please visit our <a href="${process.env.FRONTEND_URL}/plans">plans page</a>.</p>
        
        <p>If you change your mind and would like to keep your ${formattedTier} subscription, you can <a href="${process.env.FRONTEND_URL}/subscription/manage">reactivate it here</a> before the downgrade date.</p>
        
        <p>Thank you for being part of the ElderFit Secrets community!</p>
        
        <p>The ElderFit Secrets Team</p>
        
        <hr style="border: 1px solid #EEEEEE; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #888888; text-align: center;">
          You're receiving this email because you requested to downgrade your ElderFit Secrets subscription.<br />
          To manage your subscription, <a href="${process.env.FRONTEND_URL}/subscription/manage">click here</a>.
        </p>
      </div>
    `
  };
  
  return await sendEmail(mailOptions);
};

// Send email when downgrade to basic is complete
const sendSubscriptionDowngradeCompleteEmail = async (email, { firstName }) => {
  const mailOptions = {
    email,
    subject: 'Your ElderFit Secrets Basic Plan is Now Active',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4A90E2; text-align: center;">Welcome to ElderFit Secrets Basic!</h1>
        
        <p>Hello ${firstName},</p>
        
        <p>Your subscription has been successfully downgraded to the <strong>Basic</strong> free plan as requested.</p>
        
        <div style="background-color: #F5F5F5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Your Basic Plan Includes:</h3>
          <ul>
            <li>Access to basic workout routines</li>
            <li>Exercise library with step-by-step instructions</li>
            <li>Progress tracking for up to 5 workouts</li>
            <li>Simple workout calendar</li>
            <li>Basic safety guidelines</li>
          </ul>
        </div>
        
        <p>You can continue to use ElderFit Secrets with these Basic features at no cost. Your account information, workout history, and progress data remain intact.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/subscription/plans" style="background-color: #4A90E2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Explore Premium Plans</a>
        </div>
        
        <p>If you ever want to upgrade back to a premium tier to access additional features, you can do so at any time.</p>
        
        <p>Thank you for being part of the ElderFit Secrets community!</p>
        
        <p>The ElderFit Secrets Team</p>
        
        <hr style="border: 1px solid #EEEEEE; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #888888; text-align: center;">
          You're receiving this email because your ElderFit Secrets subscription has been downgraded to the free Basic plan.<br />
          To upgrade your plan, <a href="${process.env.FRONTEND_URL}/subscription/plans">click here</a>.
        </p>
      </div>
    `
  };
  
  return await sendEmail(mailOptions);
};

// Helper function to get tier benefits for email templates
function getTierBenefits(tier) {
  const tierBenefits = {
    'basic': `
      <ul>
        <li>Access to basic workout routines</li>
        <li>Exercise library with step-by-step instructions</li>
        <li>Progress tracking for up to 5 workouts</li>
        <li>Simple workout calendar</li>
        <li>Basic safety guidelines</li>
      </ul>
    `,
    'premium': `
      <ul>
        <li>Everything in the Basic plan</li>
        <li>Unlimited workout tracking</li>
        <li>Personalized exercise recommendations</li>
        <li>Access to live weekly guidance sessions</li>
        <li>Safety features for exercise modifications</li>
        <li>Advanced calendar and scheduling</li>
        <li>Email and chat support</li>
      </ul>
    `,
    'elite': `
      <ul>
        <li>Everything in the Premium plan</li>
        <li>One-on-one virtual coaching sessions</li>
        <li>Family monitoring dashboard</li>
        <li>Emergency contact integration</li>
        <li>Advanced health tracking features</li>
        <li>Priority customer support</li>
        <li>Custom workout plans designed for your needs</li>
      </ul>
    `
  };
  
  return tierBenefits[tier.toLowerCase()] || '';
}

export {
  sendSubscriptionWelcomeEmail,
  sendSubscriptionUpgradeEmail,
  sendSubscriptionCancellationEmail,
  sendSubscriptionReactivatedEmail,
  sendSubscriptionEndedEmail,
  sendPaymentFailedEmail,
  sendSubscriptionDowngradeEmail,
  sendSubscriptionDowngradeCompleteEmail
};