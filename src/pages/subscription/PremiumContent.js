// src/pages/subscription/PremiumContent.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import FeatureGate from '../../components/subscription/FeatureGate';

const PremiumContent = () => {
  return (
    <FeatureGate requiredTier="premium">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <h1>Premium Plan Content</h1>
            <p className="lead">Welcome to your Premium plan features and content.</p>
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h3>Personalized Recommendations</h3>
              </div>
              <div className="card-body">
                <p>Get personalized workout recommendations based on your fitness level and goals.</p>
                <ul>
                  <li>Tailored exercise plans</li>
                  <li>Adaptive difficulty</li>
                  <li>Progress-based suggestions</li>
                </ul>
              </div>
              <div className="card-footer">
                <Link to="/recommendations" className="btn btn-primary">View Recommendations</Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h3>Weekly Live Sessions</h3>
              </div>
              <div className="card-body">
                <p>Join our live weekly guidance sessions with professional fitness instructors.</p>
                <ul>
                  <li>Real-time feedback</li>
                  <li>Group motivation</li>
                  <li>Expert instruction</li>
                </ul>
              </div>
              <div className="card-footer">
                <Link to="/live-sessions" className="btn btn-primary">View Schedule</Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h3>Safety Modifications</h3>
              </div>
              <div className="card-body">
                <p>Access detailed exercise modifications tailored to different mobility levels.</p>
                <ul>
                  <li>High mobility options</li>
                  <li>Medium mobility adaptations</li>
                  <li>Low mobility alternatives</li>
                </ul>
              </div>
              <div className="card-footer">
                <Link to="/safety-modifications" className="btn btn-primary">Explore Modifications</Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h3>Want Even More?</h3>
                    <p>Upgrade to Elite to unlock one-on-one coaching, family monitoring dashboard, emergency contact integration, and more!</p>
                  </div>
                  <div className="col-md-4 text-center text-md-end">
                    <Link to="/subscription/upgrade" className="btn btn-success btn-lg">Upgrade to Elite</Link>
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

export default PremiumContent;