import { formAnalysisService } from './formAnalysis';

class SafetyMonitoringService {
  constructor() {
    this.safetyHistory = new Map();
    this.activeAlerts = new Set();
    this.riskThresholds = {
      posture: 0.8,
      movement: 0.8,
      fatigue: 0.7,
      pain: 0.6
    };
  }

  async monitorWorkout(exerciseId, userData, realTimeData) {
    try {
      // Pre-workout safety check
      const preWorkoutAssessment = await this.performPreWorkoutAssessment(userData);
      
      // Real-time monitoring
      const realTimeMonitoring = await this.monitorRealTime(exerciseId, realTimeData);
      
      // Post-workout analysis
      const postWorkoutAnalysis = await this.analyzePostWorkout(exerciseId, realTimeData);

      // Generate safety report
      const safetyReport = this.generateSafetyReport({
        preWorkout: preWorkoutAssessment,
        realTime: realTimeMonitoring,
        postWorkout: postWorkoutAnalysis
      });

      // Store safety data
      this.storeSafetyData(exerciseId, safetyReport);

      return safetyReport;
    } catch (error) {
      console.error('Error in safety monitoring:', error);
      throw error;
    }
  }

  async performPreWorkoutAssessment(userData) {
    const { healthConditions, recentPain, fatigueLevel } = userData;
    
    return {
      riskLevel: this.calculatePreWorkoutRisk(healthConditions, recentPain, fatigueLevel),
      recommendations: this.generatePreWorkoutRecommendations(healthConditions, recentPain, fatigueLevel),
      modifications: this.suggestPreWorkoutModifications(healthConditions, recentPain, fatigueLevel)
    };
  }

  async monitorRealTime(exerciseId, realTimeData) {
    const { formData, vitalSigns, userFeedback } = realTimeData;
    
    // Get form analysis
    const formAnalysis = await formAnalysisService.analyzeForm(exerciseId, formData);
    
    return {
      formSafety: this.assessFormSafety(formAnalysis),
      vitalSigns: this.monitorVitalSigns(vitalSigns),
      userFeedback: this.processUserFeedback(userFeedback),
      alerts: this.generateRealTimeAlerts(formAnalysis, vitalSigns, userFeedback)
    };
  }

  async analyzePostWorkout(exerciseId, workoutData) {
    const { performance, feedback, vitalSigns } = workoutData;
    
    return {
      performance: this.analyzePerformance(performance),
      recovery: this.assessRecovery(feedback, vitalSigns),
      recommendations: this.generatePostWorkoutRecommendations(performance, feedback, vitalSigns)
    };
  }

  generateSafetyReport(data) {
    const { preWorkout, realTime, postWorkout } = data;
    
    return {
      riskAssessment: this.calculateOverallRisk(preWorkout, realTime, postWorkout),
      safetyScore: this.calculateSafetyScore(preWorkout, realTime, postWorkout),
      recommendations: this.combineRecommendations(preWorkout, realTime, postWorkout),
      alerts: this.combineAlerts(preWorkout, realTime, postWorkout)
    };
  }

  calculateOverallRisk(preWorkout, realTime, postWorkout) {
    const risks = {
      preWorkout: preWorkout.riskLevel,
      realTime: this.calculateRealTimeRisk(realTime),
      postWorkout: this.calculatePostWorkoutRisk(postWorkout)
    };

    return {
      individual: risks,
      overall: this.calculateCombinedRisk(risks)
    };
  }

  calculateSafetyScore(preWorkout, realTime, postWorkout) {
    // Implementation of safety score calculation
    return {
      score: this.calculateOverallScore(preWorkout, realTime, postWorkout),
      breakdown: this.getScoreBreakdown(preWorkout, realTime, postWorkout)
    };
  }

  combineRecommendations(preWorkout, realTime, postWorkout) {
    return {
      immediate: this.getImmediateRecommendations(realTime),
      shortTerm: this.getShortTermRecommendations(postWorkout),
      longTerm: this.getLongTermRecommendations(preWorkout, postWorkout)
    };
  }

  combineAlerts(preWorkout, realTime, postWorkout) {
    const alerts = new Set();
    
    // Add pre-workout alerts
    if (preWorkout.riskLevel > this.riskThresholds.preWorkout) {
      alerts.add('High pre-workout risk level detected');
    }
    
    // Add real-time alerts
    realTime.alerts.forEach(alert => alerts.add(alert));
    
    // Add post-workout alerts
    if (postWorkout.recovery.risk > this.riskThresholds.postWorkout) {
      alerts.add('Recovery risk detected');
    }
    
    return Array.from(alerts);
  }

  storeSafetyData(exerciseId, safetyData) {
    if (!this.safetyHistory.has(exerciseId)) {
      this.safetyHistory.set(exerciseId, []);
    }
    
    this.safetyHistory.get(exerciseId).push({
      timestamp: new Date().toISOString(),
      ...safetyData
    });
  }

  getSafetyHistory(exerciseId) {
    return this.safetyHistory.get(exerciseId) || [];
  }

  getSafetyTrends(exerciseId) {
    const history = this.getSafetyHistory(exerciseId);
    if (history.length === 0) return null;

    return {
      riskTrend: this.calculateRiskTrend(history),
      safetyScoreTrend: this.calculateSafetyScoreTrend(history),
      alertFrequency: this.calculateAlertFrequency(history)
    };
  }
}

export const safetyMonitoringService = new SafetyMonitoringService(); 