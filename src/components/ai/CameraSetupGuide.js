import React from 'react';
import { Camera, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

const CameraSetupGuide = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">AI Form Analysis Setup Guide</h2>
      
      {/* Camera Setup Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Camera className="mr-2" />
          Camera Setup
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <CheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Position Your Camera</p>
              <p className="text-gray-600">Place your device 6-8 feet away from your exercise space. The camera should capture your full body.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Camera Height</p>
              <p className="text-gray-600">Position the camera at waist height for optimal tracking of your movements.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Stable Position</p>
              <p className="text-gray-600">Ensure your device is stable. Use a tripod or stable surface if possible.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lighting Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Lightbulb className="mr-2" />
          Lighting Requirements
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <CheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Good Lighting</p>
              <p className="text-gray-600">Ensure your exercise space is well-lit. Natural light or bright room lighting works best.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Avoid Backlighting</p>
              <p className="text-gray-600">Don't stand with a bright light or window behind you. This can make it difficult for the AI to track your movements.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clothing Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <CheckCircle className="mr-2" />
          Clothing Recommendations
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <CheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Wear Contrasting Colors</p>
              <p className="text-gray-600">Choose clothing that contrasts with your background for better movement tracking.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Fitted Clothing</p>
              <p className="text-gray-600">Wear fitted (but comfortable) clothing to help the AI track your body movements accurately.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <AlertTriangle className="mr-2" />
          Safety Tips
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <CheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Clear Space</p>
              <p className="text-gray-600">Ensure your exercise area is clear of obstacles and has enough space for movement.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Stop if Uncomfortable</p>
              <p className="text-gray-600">If you feel any discomfort or the AI suggests your form needs correction, stop and adjust your position.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Ready to Start?</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Click "Start Workout" to begin</li>
          <li>Allow camera access when prompted</li>
          <li>Position yourself according to the setup guide</li>
          <li>Follow the exercise instructions</li>
          <li>Watch for real-time form feedback</li>
        </ol>
      </div>
    </div>
  );
};

export default CameraSetupGuide; 