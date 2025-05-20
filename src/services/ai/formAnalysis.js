import { calculateJointAngles, detectPosture, analyzeMovementPattern } from '../../utils/motionAnalysis';

class FormAnalysisService {
  constructor() {
    this.formHistory = new Map();
    this.realTimeFeedback = new Map();
  }

  async analyzeForm(exerciseId, realTimeData) {
    try {
      // Validate and normalize input data
      const postureData = this.validatePostureData(realTimeData?.postureData);
      const movementData = this.validateMovementData(realTimeData?.movementData);
      const jointAngles = this.validateJointAngles(realTimeData?.jointAngles);

      console.log('Posture data:', postureData);
      console.log('Movement data:', movementData);
      console.log('Joint angles:', jointAngles);

      // Generate feedback based on validated data
      const feedback = this.generateFeedback(postureData, movementData, jointAngles);
      console.log('Generated feedback:', feedback);

      // Store analysis results using the correct function name
      this.storeAnalysis(exerciseId, {
        timestamp: new Date().toISOString(),
        postureData,
        movementData,
        jointAngles,
        feedback
      });

      return feedback;
    } catch (error) {
      console.error('Error in form analysis:', error);
      return this.generateDefaultFeedback();
    }
  }

  validatePostureData(data) {
    if (!data || typeof data !== 'object') {
      return {
        alignment: 0.5, // Default to middle value
        stability: 0.5,
        risk: 0
      };
    }

    return {
      alignment: this.normalizeValue(data.alignment, 0, 1),
      stability: this.normalizeValue(data.stability, 0, 1),
      risk: this.normalizeValue(data.risk, 0, 1)
    };
  }

  validateMovementData(data) {
    if (!data || typeof data !== 'object') {
      return {
        control: 0.5,
        range: 0.5,
        symmetry: 0.5,
        risk: 0
      };
    }

    return {
      control: this.normalizeValue(data.control, 0, 1),
      range: this.normalizeValue(data.range, 0, 1),
      symmetry: this.normalizeValue(data.symmetry, 0, 1),
      risk: this.normalizeValue(data.risk, 0, 1)
    };
  }

  validateJointAngles(data) {
    if (!data || typeof data !== 'object') {
      return {
        neck: 0,
        shoulder: 0,
        elbow: 0,
        wrist: 0,
        hip: 0,
        knee: 0,
        ankle: 0
      };
    }

    return Object.entries(data).reduce((acc, [joint, angle]) => {
      acc[joint] = this.normalizeValue(angle, 0, 180);
      return acc;
    }, {});
  }

  normalizeValue(value, min, max) {
    if (typeof value !== 'number' || isNaN(value)) {
      return (min + max) / 2; // Return middle value if invalid
    }
    return Math.max(min, Math.min(max, value));
  }

  generateDefaultFeedback() {
    return {
      immediate: ['Please ensure you are visible in the camera frame', 'Try to maintain a stable position'],
      suggestions: {
        posture: ['Keep your back straight', 'Maintain proper alignment'],
        movement: ['Move slowly and controlled', 'Focus on proper form']
      },
      safetyAlerts: []
    };
  }

  generateFeedback(posture, movement, joints) {
    const feedback = [];
    
    // Posture feedback
    if (posture.alignment > 0.8) {
      feedback.push('Great posture!');
    } else if (posture.alignment < 0.6) {
      feedback.push('Try to maintain better posture alignment');
    }

    // Movement feedback
    if (movement.control < 0.7) {
      feedback.push('Focus on controlled movements');
    }

    // Joint feedback
    Object.entries(joints).forEach(([joint, angle]) => {
      if (angle > 0.9) {
        feedback.push(`Be careful with ${joint} extension`);
      }
    });

    return {
      immediate: feedback,
      suggestions: this.getFormSuggestions(posture, movement, joints),
      safetyAlerts: this.getSafetyAlerts(posture, movement, joints)
    };
  }

  getFormSuggestions(posture, movement, joints) {
    return {
      posture: this.getPostureSuggestions(posture),
      movement: this.getMovementSuggestions(movement),
      joints: this.getJointSuggestions(joints)
    };
  }

  getPostureSuggestions(posture) {
    const suggestions = [];
    
    if (posture.alignment < 0.7) {
      suggestions.push('Maintain neutral spine alignment');
      suggestions.push('Keep your shoulders back and down');
    }
    
    if (posture.stability < 0.7) {
      suggestions.push('Engage your core muscles');
      suggestions.push('Focus on maintaining balance');
    }
    
    if (posture.risk > 0.5) {
      suggestions.push('Be mindful of your posture to prevent strain');
    }
    
    return suggestions;
  }

  getMovementSuggestions(movement) {
    const suggestions = [];
    
    if (movement.control < 0.7) {
      suggestions.push('Focus on controlled, smooth movements');
    }
    
    if (movement.range < 0.7) {
      suggestions.push('Try to achieve full range of motion');
    }
    
    if (movement.symmetry < 0.7) {
      suggestions.push('Work on maintaining symmetry in your movements');
    }
    
    return suggestions;
  }

  getJointSuggestions(joints) {
    const suggestions = [];
    
    Object.entries(joints).forEach(([joint, angle]) => {
      if (angle > 0.9) {
        suggestions.push(`Maintain safe ${joint} range of motion`);
      }
    });
    
    return suggestions;
  }

  getSafetyAlerts(posture, movement, joints) {
    const alerts = [];
    
    // Check for potentially dangerous positions
    if (posture.risk > 0.8) {
      alerts.push('Warning: High-risk posture detected');
    }

    // Check for unsafe movement patterns
    if (movement.risk > 0.8) {
      alerts.push('Warning: Unsafe movement pattern detected');
    }

    return alerts;
  }

  storeAnalysis(exerciseId, analysisData) {
    if (!this.formHistory.has(exerciseId)) {
      this.formHistory.set(exerciseId, []);
    }
    
    this.formHistory.get(exerciseId).push(analysisData);
  }

  getFormHistory(exerciseId) {
    return this.formHistory.get(exerciseId) || [];
  }

  getFormProgress(exerciseId) {
    const history = this.getFormHistory(exerciseId);
    if (history.length === 0) return null;

    return {
      improvement: this.calculateImprovement(history),
      consistency: this.calculateConsistency(history),
      riskLevel: this.calculateRiskLevel(history)
    };
  }

  calculateImprovement(history) {
    // Implementation of improvement calculation
    return {
      posture: this.calculateMetricImprovement(history, 'postureData'),
      movement: this.calculateMetricImprovement(history, 'movementData'),
      joints: this.calculateMetricImprovement(history, 'jointAngles')
    };
  }

  calculateConsistency(history) {
    // Implementation of consistency calculation
    return {
      overall: this.calculateOverallConsistency(history),
      byMetric: this.calculateMetricConsistency(history)
    };
  }

  calculateRiskLevel(history) {
    // Implementation of risk level calculation
    return {
      current: this.calculateCurrentRisk(history),
      trend: this.calculateRiskTrend(history)
    };
  }
}

export const formAnalysisService = new FormAnalysisService(); 