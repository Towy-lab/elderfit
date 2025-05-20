import React from 'react';
import { Camera, Lightbulb, Ruler, AlertCircle } from 'lucide-react';

export const CameraSetupGuide = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Camera Setup Guide</h3>
      
      {/* Camera Position */}
      <div className="flex items-start space-x-4">
        <Camera className="text-blue-500 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Camera Position</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Place your camera at eye level</li>
            <li>Position yourself 6-8 feet from the camera</li>
            <li>Ensure your full body is visible in the frame</li>
            <li>Keep the camera stable during the exercise</li>
          </ul>
        </div>
      </div>

      {/* Lighting */}
      <div className="flex items-start space-x-4">
        <Lightbulb className="text-yellow-500 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Lighting</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Ensure good lighting in your space</li>
            <li>Avoid backlighting (don't stand in front of windows)</li>
            <li>Use natural or artificial lighting that illuminates your body</li>
            <li>Avoid harsh shadows or glare</li>
          </ul>
        </div>
      </div>

      {/* Space Requirements */}
      <div className="flex items-start space-x-4">
        <Ruler className="text-green-500 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Space Requirements</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Clear a space of at least 8x8 feet</li>
            <li>Remove any obstacles or tripping hazards</li>
            <li>Ensure you have enough room to move freely</li>
            <li>Keep pets and other distractions out of the area</li>
          </ul>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="flex items-start space-x-4">
        <AlertCircle className="text-red-500 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Safety Tips</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Wear appropriate workout clothing</li>
            <li>Use a non-slip surface for your workout</li>
            <li>Have water nearby</li>
            <li>Stop immediately if you feel pain or discomfort</li>
          </ul>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-700">
          For best results, follow these setup instructions carefully. The AI form analysis works best when it has a clear view of your movements and proper lighting conditions.
        </p>
      </div>
    </div>
  );
}; 