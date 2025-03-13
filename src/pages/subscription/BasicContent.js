// src/pages/subscription/BasicContent.js
import React from 'react';
import { Link } from 'react-router-dom';

const BasicContent = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1>Basic Plan Content</h1>
          <p className="lead">Welcome to your Basic plan features and content.</p>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Beginner Workouts</h3>
            </div>
            <div className="card-body">
              <p>Access our collection of beginner-friendly workouts designed specifically for seniors.</p>
              <ul>
                <li>Simple movements</li>
                <li>Low impact exercises</li>
                <li>Clear instructions</li>
              </ul>
            </div>
            <div className="card-footer">
              <Link to="/workouts/beginner" className="btn btn-primary">View Workouts</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Exercise Library</h3>
            </div>
            <div className="card-body">
              <p>Browse our basic exercise library with step-by-step instructions.</p>
              <ul>
                <li>Detailed form guides</li>
                <li>Exercise benefits</li>
                <li>Video demonstrations</li>
              </ul>
            </div>
            <div className="card-footer">
              <Link to="/exercises" className="btn btn-primary">Explore Exercises</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Progress Tracking</h3>
            </div>
            <div className="card-body">
              <p>Track your workout progress for up to 5 different workouts.</p>
              <ul>
                <li>Record completed workouts</li>
                <li>Set simple goals</li>
                <li>View basic statistics</li>
              </ul>
            </div>
            <div className="card-footer">
              <Link to="/progress" className="btn btn-primary">Track Progress</Link>
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
                  <h3>Want More Features?</h3>
                  <p>Upgrade to Premium or Elite to unlock personalized recommendations, advanced safety features, and much more!</p>
                </div>
                <div className="col-md-4 text-center text-md-end">
                  <Link to="/subscription/upgrade" className="btn btn-success btn-lg">Upgrade Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicContent;