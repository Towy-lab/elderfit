// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container text-center py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h1 className="display-1 text-muted">404</h1>
              <h2 className="mb-4">Page Not Found</h2>
              
              <p className="lead">
                We couldn't find the page you're looking for.
              </p>
              
              <div className="mt-4">
                <Link to="/" className="btn btn-primary">
                  Return to Home
                </Link>
                <Link to="/dashboard" className="btn btn-outline-secondary ms-3">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p>
              Need help? <a href="mailto:support@elderfitsecrets.com">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;