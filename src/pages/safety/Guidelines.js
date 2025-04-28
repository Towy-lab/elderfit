import React from "react";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path if needed

const SafetyGuidelines = () => {
  const { user } = useAuth();

  // Extract first name using the same logic as Dashboard
  const firstName =
    user?.firstName ||
    (user?.name ? user.name.split(" ")[0] : null) ||
    user?.first_name ||
    "Friend";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center mb-6">
        <ShieldCheck className="text-green-600 mr-2" size={32} />
        <h1 className="text-3xl font-bold text-green-800">Safety Guidelines for Seniors</h1>
      </div>
      <p className="text-green-700 mb-2">
        Welcome to Elderfit Secrets, {firstName}! Your safety is our top priority. Please read and follow these guidelines before starting any exercise program.
      </p>
      <ol className="list-decimal list-inside space-y-4 text-gray-800">
        <li>
          <span className="font-semibold">Consult Your Healthcare Provider:</span>
          <span> Before beginning any new exercise routine, talk to your doctor or healthcare provider, especially if you have any chronic conditions, recent surgeries, or concerns about your health.</span>
        </li>
        <li>
          <span className="font-semibold">Listen to Your Body:</span>
          <span> If you feel pain, dizziness, shortness of breath, or discomfort during any exercise, stop immediately and rest. Never push through pain. Mild muscle soreness is normal, but sharp or persistent pain is not.</span>
        </li>
        <li>
          <span className="font-semibold">Start Slow and Progress Gradually:</span>
          <span> Begin with beginner-level workouts and increase intensity or duration only as you feel comfortable. Allow your body time to adapt to new activities.</span>
        </li>
        <li>
          <span className="font-semibold">Warm Up and Cool Down:</span>
          <span> Always start your session with a gentle warm-up to prepare your muscles and joints. Finish with a cool-down and stretching to help your body recover.</span>
        </li>
        <li>
          <span className="font-semibold">Stay Hydrated:</span>
          <span> Drink water before, during, and after your workout, even if you don't feel thirsty.</span>
        </li>
        <li>
          <span className="font-semibold">Create a Safe Exercise Space:</span>
          <span> Make sure your workout area is free of clutter, loose rugs, or anything you could trip over. Use a sturdy chair or support for balance exercises if needed.</span>
        </li>
        <li>
          <span className="font-semibold">Wear Appropriate Clothing and Footwear:</span>
          <span> Choose comfortable, non-restrictive clothing and supportive, non-slip shoes.</span>
        </li>
        <li>
          <span className="font-semibold">Use Equipment Safely:</span>
          <span> Only use equipment (like resistance bands or weights) as instructed in the app. Check that equipment is in good condition before use.</span>
        </li>
        <li>
          <span className="font-semibold">Monitor Your Health:</span>
          <span> Keep track of your heart rate, blood pressure, and blood sugar if recommended by your doctor. If you feel unwell at any time, stop exercising and seek medical advice.</span>
        </li>
        <li>
          <span className="font-semibold">Exercise with a Buddy (if possible):</span>
          <span> If you're new to exercise or have balance concerns, consider having someone nearby or let a friend or family member know when you're working out.</span>
        </li>
        <li>
          <span className="font-semibold">Report Any Issues:</span>
          <span> If you notice any problems with the app or have questions about exercises, use the in-app support or contact our team.</span>
        </li>
      </ol>
      <div className="mt-8 p-4 bg-green-50 border-l-4 border-green-400 rounded">
        <p className="text-green-800 font-semibold">
          Remember: Your safety comes first. ElderFit Secrets is here to support your fitness journey—move at your own pace and enjoy the process!
        </p>
      </div>
    </div>
  );
};

export default SafetyGuidelines;
