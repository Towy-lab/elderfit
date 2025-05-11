import { calculateJointAngles, detectPosture, analyzeMovementPattern } from '../../utils/motionAnalysis';

class FormAnalysisService {
  constructor() {
    this.formHistory = new Map();
    this.realTimeFeedback = new Map();
  }

  async analyzeForm(exerciseId, videoStream) {
    try {
      // Real-time posture analysis
      const postureData = await detectPosture(videoStream);
      
      // Movement pattern analysis
      const movementData = await analyzeMovementPattern(videoStream);
      
      // Joint angle calculation
      const jointAngles = await calculateJointAngles(videoStream);

      // Generate feedback
      const feedback = this.generateFeedback({
        posture: postureData,
        movement: movementData,
        joints: jointAngles
      });

      // Store analysis results
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
      throw error;
    }
  }

  generateFeedback(analysisData) {
    const { posture, movement, joints } = analysisData;
    
    return {
      immediate: this.getImmediateFeedback(posture, movement, joints),
      suggestions: this.getFormSuggestions(posture, movement, joints),
      safetyAlerts: this.getSafetyAlerts(posture, movement, joints)
    };
  }

  getImmediateFeedback(posture, movement, joints) {
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

    return feedback;
  }

  getFormSuggestions(posture, movement, joints) {
    return {
      posture: this.getPostureSuggestions(posture),
      movement: this.getMovementSuggestions(movement),
      joints: this.getJointSuggestions(joints)
    };
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