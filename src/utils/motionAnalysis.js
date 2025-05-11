// Utility functions for motion analysis

/**
 * Calculate joint angles from video stream
 * @param {MediaStream} videoStream - The video stream from user's camera
 * @returns {Promise<Object>} Object containing joint angles
 */
export const calculateJointAngles = async (videoStream) => {
  // This would integrate with a pose estimation library like TensorFlow.js
  // For now, return mock data
  return {
    shoulder: 0.75,
    elbow: 0.85,
    hip: 0.65,
    knee: 0.70
  };
};

/**
 * Detect posture from video stream
 * @param {MediaStream} videoStream - The video stream from user's camera
 * @returns {Promise<Object>} Object containing posture analysis
 */
export const detectPosture = async (videoStream) => {
  // This would integrate with a pose estimation library
  // For now, return mock data
  return {
    alignment: 0.85,
    stability: 0.90,
    risk: 0.15
  };
};

/**
 * Analyze movement pattern from video stream
 * @param {MediaStream} videoStream - The video stream from user's camera
 * @returns {Promise<Object>} Object containing movement analysis
 */
export const analyzeMovementPattern = async (videoStream) => {
  // This would integrate with a pose estimation library
  // For now, return mock data
  return {
    control: 0.80,
    range: 0.75,
    symmetry: 0.85,
    risk: 0.20
  };
};

/**
 * Calculate movement velocity
 * @param {Array} positionHistory - Array of position data points
 * @returns {number} Movement velocity
 */
export const calculateVelocity = (positionHistory) => {
  if (positionHistory.length < 2) return 0;
  
  const recentPositions = positionHistory.slice(-2);
  const timeDelta = recentPositions[1].timestamp - recentPositions[0].timestamp;
  const distanceDelta = Math.sqrt(
    Math.pow(recentPositions[1].x - recentPositions[0].x, 2) +
    Math.pow(recentPositions[1].y - recentPositions[0].y, 2)
  );
  
  return distanceDelta / timeDelta;
};

/**
 * Detect movement quality
 * @param {Object} movementData - Movement analysis data
 * @returns {Object} Movement quality assessment
 */
export const detectMovementQuality = (movementData) => {
  const { control, range, symmetry } = movementData;
  
  return {
    quality: (control + range + symmetry) / 3,
    needsImprovement: control < 0.7 || range < 0.7 || symmetry < 0.7,
    suggestions: generateMovementSuggestions(movementData)
  };
};

/**
 * Generate movement suggestions based on analysis
 * @param {Object} movementData - Movement analysis data
 * @returns {Array} Array of suggestions
 */
const generateMovementSuggestions = (movementData) => {
  const suggestions = [];
  
  if (movementData.control < 0.7) {
    suggestions.push('Focus on controlled movements');
  }
  
  if (movementData.range < 0.7) {
    suggestions.push('Try to achieve full range of motion');
  }
  
  if (movementData.symmetry < 0.7) {
    suggestions.push('Work on maintaining symmetry in your movements');
  }
  
  return suggestions;
};

/**
 * Calculate stability score
 * @param {Object} postureData - Posture analysis data
 * @returns {number} Stability score (0-1)
 */
export const calculateStabilityScore = (postureData) => {
  const { alignment, stability } = postureData;
  return (alignment + stability) / 2;
};

/**
 * Detect potential injury risks
 * @param {Object} analysisData - Combined analysis data
 * @returns {Array} Array of potential risks
 */
export const detectInjuryRisks = (analysisData) => {
  const risks = [];
  const { posture, movement, joints } = analysisData;
  
  // Check posture risks
  if (posture.risk > 0.7) {
    risks.push('High-risk posture detected');
  }
  
  // Check movement risks
  if (movement.risk > 0.7) {
    risks.push('Unsafe movement pattern detected');
  }
  
  // Check joint risks
  Object.entries(joints).forEach(([joint, angle]) => {
    if (angle > 0.9) {
      risks.push(`Excessive ${joint} extension detected`);
    }
  });
  
  return risks;
};

/**
 * Generate real-time feedback
 * @param {Object} analysisData - Combined analysis data
 * @returns {Object} Feedback object
 */
export const generateRealTimeFeedback = (analysisData) => {
  const { posture, movement, joints } = analysisData;
  
  return {
    immediate: generateImmediateFeedback(posture, movement, joints),
    suggestions: generateFormSuggestions(posture, movement, joints),
    safetyAlerts: detectInjuryRisks(analysisData)
  };
};

/**
 * Generate immediate feedback
 * @param {Object} posture - Posture data
 * @param {Object} movement - Movement data
 * @param {Object} joints - Joint data
 * @returns {Array} Array of immediate feedback points
 */
const generateImmediateFeedback = (posture, movement, joints) => {
  const feedback = [];
  
  if (posture.alignment < 0.7) {
    feedback.push('Adjust your posture alignment');
  }
  
  if (movement.control < 0.7) {
    feedback.push('Focus on movement control');
  }
  
  Object.entries(joints).forEach(([joint, angle]) => {
    if (angle > 0.9) {
      feedback.push(`Reduce ${joint} extension`);
    }
  });
  
  return feedback;
};

/**
 * Generate form suggestions
 * @param {Object} posture - Posture data
 * @param {Object} movement - Movement data
 * @param {Object} joints - Joint data
 * @returns {Object} Object containing suggestions by area
 */
const generateFormSuggestions = (posture, movement, joints) => {
  return {
    posture: generatePostureSuggestions(posture),
    movement: generateMovementSuggestions(movement),
    joints: generateJointSuggestions(joints)
  };
};

/**
 * Generate posture suggestions
 * @param {Object} posture - Posture data
 * @returns {Array} Array of posture suggestions
 */
const generatePostureSuggestions = (posture) => {
  const suggestions = [];
  
  if (posture.alignment < 0.7) {
    suggestions.push('Maintain neutral spine alignment');
  }
  
  if (posture.stability < 0.7) {
    suggestions.push('Focus on core stability');
  }
  
  return suggestions;
};

/**
 * Generate joint suggestions
 * @param {Object} joints - Joint data
 * @returns {Array} Array of joint suggestions
 */
const generateJointSuggestions = (joints) => {
  const suggestions = [];
  
  Object.entries(joints).forEach(([joint, angle]) => {
    if (angle > 0.9) {
      suggestions.push(`Maintain safe ${joint} range of motion`);
    }
  });
  
  return suggestions;
}; 