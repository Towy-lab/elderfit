import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Play, Info } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { formAnalysisService } from '../../services/ai/formAnalysis';
import { safetyMonitoringService } from '../../services/ai/safetyMonitoring';
import { detectPosture, analyzeMovementPattern, calculateJointAngles } from '../../utils/motionAnalysis';
import { CameraSetupGuide } from './CameraSetupGuide';
import { FormFeedback } from './FormFeedback';
import { SafetyAlerts } from './SafetyAlerts';

const FormGuidance = ({ exercise }) => {
  const { logFormCheck } = useSafety();
  const { subscription } = useSubscription();
  const [formAnalysis, setFormAnalysis] = useState(null);
  const [safetyData, setSafetyData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const videoRef = useRef(null);
  const analysisInterval = useRef(null);
  const analysisTimeout = useRef(null);
  const countdownInterval = useRef(null);

  // Cleanup function
  const cleanupFunction = () => {
    if (analysisInterval.current) {
      clearInterval(analysisInterval.current);
      analysisInterval.current = null;
    }
    if (analysisTimeout.current) {
      clearTimeout(analysisTimeout.current);
      analysisTimeout.current = null;
    }
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsAnalyzing(false);
    setTimeRemaining(30);
    setAnalysisError(null);
  };

  useEffect(() => {
    return cleanupFunction;
  }, [videoStream]);

  const startFormAnalysis = async () => {
    if (isAnalyzing) return;
    
    try {
      setCameraError(null);
      setAnalysisError(null);
      setTimeRemaining(30);
      
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      console.log('Camera access granted:', stream);
      
      if (!videoRef.current) {
        throw new Error('Video element not found');
      }
      
      console.log('Setting video stream to video element');
      videoRef.current.srcObject = stream;
      setVideoStream(stream);
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        if (videoRef.current.readyState >= 2) {
          resolve();
        } else {
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            videoRef.current.play().then(() => {
              console.log('Video playback started');
              resolve();
            });
          };
        }
      });
      
      setIsAnalyzing(true);
      
      // Set up countdown timer
      countdownInterval.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval.current);
            stopAnalysis(); // Stop analysis when timer reaches 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Set up analysis interval
      analysisInterval.current = setInterval(async () => {
        try {
          if (!videoRef.current || !videoRef.current.srcObject) {
            throw new Error('Video element not found or no stream');
          }

          const realTimeData = {
            postureData: await detectPosture(videoRef.current),
            movementData: await analyzeMovementPattern(videoRef.current),
            jointAngles: await calculateJointAngles(videoRef.current)
          };

          const feedback = await formAnalysisService.analyzeForm(exercise.id, realTimeData);
          setFormAnalysis(feedback);

          // Monitor safety
          const safety = await safetyMonitoringService.monitorWorkout({
            exerciseId: exercise.id,
            formAnalysis: feedback
          });
          setSafetyData(safety);

          // Log form check
          logFormCheck({
            exerciseId: exercise.id,
            timestamp: new Date(),
            passed: feedback.immediate.length === 0,
            feedback: feedback
          });
        } catch (error) {
          console.error('Error during form analysis:', error);
          setAnalysisError('Error analyzing form. Please try again.');
          stopAnalysis();
        }
      }, 1000);

      // Set timeout to stop analysis after 30 seconds
      analysisTimeout.current = setTimeout(() => {
        stopAnalysis();
      }, 30000);

    } catch (error) {
      console.error('Error starting form analysis:', error);
      setCameraError('Failed to access camera. Please ensure camera permissions are granted.');
      setIsAnalyzing(false);
    }
  };

  const stopAnalysis = () => {
    cleanupFunction();
  };

  if (!subscription?.tier || subscription.tier === 'free') {
    return (
      <div className="text-center p-8">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Upgrade Required</h2>
        <p className="text-gray-600">
          Upgrade to Premium to access real-time form analysis and personalized feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Exercise Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">{exercise.name}</h3>
        <p className="text-gray-600 mb-6">{exercise.description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
            onClick={() => setShowSetupGuide(true)}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <Info className="mr-2 h-5 w-5" />
            View Setup Instructions
          </button>
          
          <button
            onClick={isAnalyzing ? stopAnalysis : startFormAnalysis}
            disabled={isAnalyzing && !videoStream}
            className={`${
              isAnalyzing 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
              isAnalyzing && !videoStream ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Play className={`mr-2 h-5 w-5 ${isAnalyzing ? 'rotate-90' : ''}`} />
            {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
          </button>
        </div>
      </div>

      {/* Setup Guide Modal */}
      {showSetupGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowSetupGuide(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              type="button"
            >
              <AlertCircle className="h-6 w-6" />
            </button>
            <div className="p-6">
              <CameraSetupGuide />
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {(cameraError || analysisError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="text-red-700">{cameraError || analysisError}</p>
              <button
                onClick={startFormAnalysis}
                className="mt-2 text-red-600 hover:text-red-700 font-medium"
                type="button"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview */}
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg"
          style={{ display: videoStream ? 'block' : 'none' }}
        />
        {!videoStream && (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Camera preview will appear here</p>
          </div>
        )}
        {isAnalyzing && videoStream && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Analyzing form...</p>
              <p className="text-2xl font-bold mt-2">{timeRemaining}s</p>
            </div>
          </div>
        )}
      </div>

      {/* Exercise Instructions */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Current Exercise: {exercise.name}</h4>
        <p className="text-gray-600">{exercise.description}</p>
      </div>

      {/* Ready to Start? */}
      {!isAnalyzing && !videoStream && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Ready to Start?</h4>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Position yourself in front of the camera</li>
            <li>Ensure good lighting</li>
            <li>Stand about 6 feet from the camera</li>
            <li>Click "Start Analysis" when ready</li>
          </ol>
        </div>
      )}

      {/* Analysis Results */}
      {formAnalysis && (
        <div className="mt-6">
          <FormFeedback feedback={formAnalysis} />
        </div>
      )}

      {/* Safety Alerts */}
      {safetyData?.alerts && (
        <div className="mt-4">
          <SafetyAlerts alerts={safetyData.alerts} />
        </div>
      )}
    </div>
  );
};

export default FormGuidance;