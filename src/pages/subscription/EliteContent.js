// src/pages/subscription/EliteContent.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import FeatureGate from '../../components/subscription/FeatureGate';

const EliteContent = () => {
  return (
    <FeatureGate requiredTier="elite">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <h1>Elite Plan Content</h1>
            <p className="lead">Welcome to your Elite plan features and content. Enjoy access to our most comprehensive fitness resources.</p>
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-success text-white">
                <h3>One-on-One Coaching</h3>
              </div>
              <div className="card-body">
                <p>Schedule virtual coaching sessions with our senior fitness specialists.</p>
                <ul>
                  <li>Personalized attention</li>
                  <li>Custom workout plans</li>
                  <li>Form correction and guidance</li>
                </ul>
              </div>
              <div className="card-footer">
                <Link to="/coaching" className="btn btn-success">Schedule Session</Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-success text-white">
                <h3>Family Dashboard</h3>
              </div>
              <div className="card-body">
                <p>Give family members access to monitor your activity and progress.</p>
                <ul>
                  <li>Activity sharing</li>
                  <li>Progress reports</li>
                  <li>Exercise completion notifications</li>
                </ul>
              </div>
              <div className="card-footer">
                <Link to="/family-dashboard" className="btn btn-success">Manage Access</Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-success text-white">
                <h3>Emergency Contact Integration</h3>
              </div>
              <div className="card-body">
                <p>Set up emergency contacts with customizable alert conditions.</p>
                <ul>
                  <li>Automated check-ins</li>
                  <li>Customizable alert thresholds</li>
                  <li>One-touch emergency access</li>
                </ul>
              </div>
              <div className="card-footer">
                <Link to="/emergency-contacts" className="btn btn-success">Configure Contacts</Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-12">
            <div className="card bg-light">
              <div className="card-body">
                <h3>Custom Workout Plans</h3>
                <p>Our fitness specialists create personalized workout plans designed specifically for your needs, goals, and health conditions.</p>
                <div className="text-center">
                  <Link to="/custom-plans" className="btn btn-success">View Your Custom Plans</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-12">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h3>Need Help?</h3>
                    <p>As an Elite member, you have access to priority customer support. Our team is ready to assist you with any questions or concerns.</p>
                  </div>
                  <div className="col-md-4 text-center text-md-end">
                    <Link to="/support" className="btn btn-light">Contact Priority Support</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
};

export default EliteContent;