// src/pages/subscription/SubscriptionUpgradePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext.js';
import UpgradeSubscriptionForm from '../../components/subscription/UpgradeSubscriptionForm.js';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.js';
import { Button } from '../../components/ui/button.js';
import { Badge } from '../../components/ui/badge.js';
import { Progress } from '../../components/ui/progress.js';
import { Crown, Shield, Smartphone, Activity, Heart, Brain, Target, TrendingUp, Zap, Star, Users, Calendar, Clock, Award, Play, Settings, Info, AlertTriangle, Check, X, RotateCcw, Pause, BookOpen, Video, Users as UsersIcon, Award as AwardIcon, Calendar as CalendarIcon, ArrowRight, Home, Menu, User, LogOut, Settings as SettingsIcon, Home as HomeIcon, Activity as ActivityIcon, Shield as ShieldIcon, Heart as HeartIcon, BookOpen as BookOpenIcon, HelpCircle } from 'lucide-react';

const SubscriptionUpgradePage = () => {
  const navigate = useNavigate();
  const { hasTierAccess } = useSubscription();
  
  // Handle successful upgrade
  const handleUpgradeSuccess = () => {
    navigate('/subscription/manage');
  };
  
  return (
    <div className="subscription-upgrade-page container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <h1>Upgrade Your Subscription</h1>
          <p className="lead">
            Choose a plan that best suits your fitness needs.
          </p>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <UpgradeSubscriptionForm onSuccess={handleUpgradeSuccess} />
        </div>
        
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h3>Why Upgrade?</h3>
            </div>
            <div className="card-body">
              <ul className="fa-ul">
                <li>
                  <span className="fa-li"><i className="fas fa-check-circle text-success"></i></span>
                  <strong>Personalized guidance</strong> tailored to your fitness level
                </li>
                <li>
                  <span className="fa-li"><i className="fas fa-check-circle text-success"></i></span>
                  <strong>Unlimited workout tracking</strong> to monitor your progress
                </li>
                <li>
                  <span className="fa-li"><i className="fas fa-check-circle text-success"></i></span>
                  <strong>Advanced safety features</strong> for peace of mind
                </li>
                <li>
                  <span className="fa-li"><i className="fas fa-check-circle text-success"></i></span>
                  <strong>Priority support</strong> from our senior fitness experts
                </li>
              </ul>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3>Need Help?</h3>
            </div>
            <div className="card-body">
              <p>
                Not sure which plan is right for you? Our team is here to help you choose the best option for your needs.
              </p>
              <div className="d-grid gap-2">
                <a 
                  href="mailto:support@elderfitsecrets.com" 
                  className="btn btn-outline-primary"
                >
                  Contact Support
                </a>
                <Link to="/subscription/plans" className="btn btn-link">
                  Compare All Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpgradePage;