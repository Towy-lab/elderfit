import React from 'react';
import { AlertTriangle, Phone, Heart, Shield } from 'lucide-react';

const EmergencyProcedures = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Emergency Procedures</h1>
      
      {/* Emergency Contact Section */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="text-red-600" size={24} />
          <h2 className="text-xl font-semibold text-red-800">Emergency Contacts</h2>
        </div>
        <p className="text-red-700 mb-4">
          In case of emergency, call 911 immediately. Then contact your emergency contacts.
        </p>
        <div className="space-y-2">
          <p className="text-red-700">• Keep your emergency contacts updated in your profile</p>
          <p className="text-red-700">• Ensure your medical information is current</p>
          <p className="text-red-700">• Have your medications list readily available</p>
        </div>
      </div>

      {/* Common Exercise Emergencies */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-red-500" size={24} />
            <h2 className="text-xl font-semibold">Chest Pain or Discomfort</h2>
          </div>
          <div className="space-y-3">
            <p className="text-gray-700">If you experience:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Chest pain or pressure</li>
              <li>Shortness of breath</li>
              <li>Pain radiating to arm, neck, or jaw</li>
              <li>Nausea or dizziness</li>
            </ul>
            <p className="text-red-600 font-medium">STOP exercising immediately and call 911</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-yellow-500" size={24} />
            <h2 className="text-xl font-semibold">Dizziness or Lightheadedness</h2>
          </div>
          <div className="space-y-3">
            <p className="text-gray-700">If you feel:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Dizzy or lightheaded</li>
              <li>Unsteady on your feet</li>
              <li>Confused or disoriented</li>
            </ul>
            <p className="text-gray-700">STOP exercising and:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Sit or lie down immediately</li>
              <li>Stay hydrated</li>
              <li>Contact your healthcare provider if symptoms persist</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold">Fall Prevention</h2>
          </div>
          <div className="space-y-3">
            <p className="text-gray-700">If you feel unsteady:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Stop the exercise immediately</li>
              <li>Find a stable surface to hold onto</li>
              <li>Call for assistance if needed</li>
            </ul>
            <p className="text-gray-700">Prevention tips:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Wear proper footwear</li>
              <li>Exercise in a well-lit area</li>
              <li>Keep your exercise space clear of obstacles</li>
              <li>Use assistive devices if recommended</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Additional Resources</h2>
        <div className="space-y-3">
          <p className="text-blue-700">• Keep a list of your medications and allergies</p>
          <p className="text-blue-700">• Have your insurance information readily available</p>
          <p className="text-blue-700">• Know the location of the nearest hospital</p>
          <p className="text-blue-700">• Consider wearing a medical alert device</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyProcedures; 