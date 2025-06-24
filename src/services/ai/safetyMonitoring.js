import { formAnalysisService } from './formAnalysis.js';
import { motionAnalysisService } from '../utils/motionAnalysis.js';
import { aiService } from './aiService.js';

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

  calculatePreWorkoutRisk(userData, exerciseData) {
    const risks = [];
    const riskLevel = {
      level: 'low',
      score: 0,
      factors: []
    };

    // Check user's health conditions
    if (userData.healthConditions && userData.healthConditions.length > 0) {
      const relevantConditions = userData.healthConditions.filter(condition => 
        exerciseData.contraindications?.includes(condition)
      );
      
      if (relevantConditions.length > 0) {
        risks.push(`Exercise may not be suitable for: ${relevantConditions.join(', ')}`);
        riskLevel.score += 0.3;
        riskLevel.factors.push('health_conditions');
      }
    }

    // Check user's fitness level vs exercise difficulty
    if (userData.fitnessLevel && exerciseData.difficulty) {
      const levelMap = { beginner: 1, intermediate: 2, advanced: 3 };
      if (levelMap[userData.fitnessLevel] < exerciseData.difficulty) {
        risks.push('Exercise difficulty may be too high for current fitness level');
        riskLevel.score += 0.2;
        riskLevel.factors.push('fitness_level');
      }
    }

    // Check for recent injuries
    if (userData.recentInjuries && userData.recentInjuries.length > 0) {
      const affectedAreas = userData.recentInjuries.filter(injury =>
        exerciseData.focusAreas?.includes(injury.area)
      );
      
      if (affectedAreas.length > 0) {
        risks.push(`Recent injuries in affected areas: ${affectedAreas.map(i => i.area).join(', ')}`);
        riskLevel.score += 0.25;
        riskLevel.factors.push('recent_injuries');
      }
    }

    // Check fatigue level
    if (userData.fatigueLevel && userData.fatigueLevel > this.riskThresholds.fatigue) {
      risks.push('High fatigue level detected');
      riskLevel.score += 0.15;
      riskLevel.factors.push('fatigue');
    }

    // Determine overall risk level
    if (riskLevel.score >= 0.6) {
      riskLevel.level = 'high';
    } else if (riskLevel.score >= 0.3) {
      riskLevel.level = 'medium';
    }

    return {
      risks,
      riskLevel,
      recommendations: this.generatePreWorkoutRecommendations(riskLevel, risks)
    };
  }

  generatePreWorkoutRecommendations(riskLevel, risks) {
    const recommendations = [];

    if (riskLevel.level === 'high') {
      recommendations.push('Consider consulting with a healthcare provider before proceeding');
      recommendations.push('Start with a modified version of the exercise');
    } else if (riskLevel.level === 'medium') {
      recommendations.push('Proceed with caution and focus on proper form');
      recommendations.push('Consider using modifications if available');
    }

    if (risks.includes('fatigue')) {
      recommendations.push('Take additional rest periods as needed');
    }

    return recommendations;
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
    // Ensure userData has required properties
    const safeUserData = {
      healthConditions: userData?.healthConditions || [],
      recentPain: userData?.recentPain || [],
      fatigueLevel: userData?.fatigueLevel || 0,
      fitnessLevel: userData?.fitnessLevel || 'beginner',
      recentInjuries: userData?.recentInjuries || []
    };

    // Get exercise data (empty object for now, should be populated from exercise data)
    const exerciseData = {
      difficulty: 1,
      focusAreas: [],
      contraindications: []
    };
    
    // Calculate risk assessment
    const riskAssessment = this.calculatePreWorkoutRisk(safeUserData, exerciseData);
    
    return {
      riskLevel: riskAssessment.riskLevel,
      recommendations: riskAssessment.recommendations,
      risks: riskAssessment.risks,
      modifications: this.suggestPreWorkoutModifications(safeUserData)
    };
  }

  suggestPreWorkoutModifications(userData) {
    const modifications = [];

    // Add modifications based on health conditions
    if (userData.healthConditions?.length > 0) {
      modifications.push('Consider using modified versions of exercises');
    }

    // Add modifications based on recent pain
    if (userData.recentPain?.length > 0) {
      modifications.push('Reduce intensity if experiencing pain');
    }

    // Add modifications based on fatigue
    if (userData.fatigueLevel > this.riskThresholds.fatigue) {
      modifications.push('Take additional rest periods');
    }

    return modifications;
  }

  async monitorRealTime(exerciseId, realTimeData) {
    try {
      // Handle undefined or missing data
      if (!realTimeData) {
        return {
          formSafety: {
            isSafe: true,
            score: 1.0,
            issues: []
          },
          vitalSigns: this.monitorVitalSigns(null),
          userFeedback: this.processUserFeedback(null),
          alerts: []
        };
      }

      // Get form analysis
      const formAnalysis = await formAnalysisService.analyzeForm(exerciseId, realTimeData);
      
      // Ensure formAnalysis has the expected structure
      if (!formAnalysis || typeof formAnalysis !== 'object') {
        console.error('Invalid form analysis data:', formAnalysis);
        return {
          formSafety: {
            isSafe: true,
            score: 1.0,
            issues: []
          },
          vitalSigns: this.monitorVitalSigns(null),
          userFeedback: this.processUserFeedback(null),
          alerts: []
        };
      }

      // The formAnalysis is already the feedback object with the correct structure
      return {
        formSafety: this.assessFormSafety(formAnalysis),
        vitalSigns: this.monitorVitalSigns(null),
        userFeedback: this.processUserFeedback(null),
        alerts: this.generateRealTimeAlerts(formAnalysis, null, null)
      };
    } catch (error) {
      console.error('Error in monitorRealTime:', error);
      return {
        formSafety: {
          isSafe: true,
          score: 1.0,
          issues: []
        },
        vitalSigns: this.monitorVitalSigns(null),
        userFeedback: this.processUserFeedback(null),
        alerts: []
      };
    }
  }

  assessFormSafety(formAnalysis) {
    // Return default safe state if formAnalysis is undefined or null
    if (!formAnalysis || typeof formAnalysis !== 'object') {
      return {
        isSafe: true,
        score: 1.0,
        issues: []
      };
    }

    try {
      // Transform the input data into a consistent structure
      const normalizedData = this.normalizeFormAnalysisData(formAnalysis);
      
      const issues = [];
      let safetyScore = 1.0;

      // Process immediate feedback
      normalizedData.immediateFeedback.forEach(feedbackItem => {
        if (typeof feedbackItem === 'string' && (
          feedbackItem.toLowerCase().includes('warning') || 
          feedbackItem.toLowerCase().includes('danger') ||
          feedbackItem.toLowerCase().includes('risk')
        )) {
          issues.push(feedbackItem);
          safetyScore -= 0.2;
        }
      });

      // Process safety alerts
      normalizedData.safetyAlerts.forEach(alert => {
        if (typeof alert === 'string') {
          issues.push(alert);
          safetyScore -= 0.3;
        }
      });

      // Process suggestions
      normalizedData.postureSuggestions.forEach(suggestion => {
        if (typeof suggestion === 'string') {
          issues.push(suggestion);
          safetyScore -= 0.1;
        }
      });

      normalizedData.movementSuggestions.forEach(suggestion => {
        if (typeof suggestion === 'string') {
          issues.push(suggestion);
          safetyScore -= 0.1;
        }
      });

      // Ensure safety score doesn't go below 0
      safetyScore = Math.max(0, safetyScore);

      return {
        isSafe: safetyScore >= 0.7,
        score: safetyScore,
        issues: [...new Set(issues)] // Remove duplicates
      };
    } catch (error) {
      console.error('Error in assessFormSafety:', error);
      return {
        isSafe: true,
        score: 1.0,
        issues: []
      };
    }
  }

  normalizeFormAnalysisData(data) {
    // Initialize with empty arrays
    const normalized = {
      immediateFeedback: [],
      safetyAlerts: [],
      postureSuggestions: [],
      movementSuggestions: []
    };

    try {
      // Handle immediate feedback
      if (Array.isArray(data?.immediate)) {
        normalized.immediateFeedback = data.immediate;
      }

      // Handle suggestions
      if (data?.suggestions) {
        if (Array.isArray(data.suggestions.posture)) {
          normalized.postureSuggestions = data.suggestions.posture;
        }
        if (Array.isArray(data.suggestions.movement)) {
          normalized.movementSuggestions = data.suggestions.movement;
        }
      }

      // Handle safety alerts
      if (Array.isArray(data?.safetyAlerts)) {
        normalized.safetyAlerts = data.safetyAlerts;
      }

      return normalized;
    } catch (error) {
      console.error('Error in normalizeFormAnalysisData:', error);
      return normalized; // Return empty arrays if normalization fails
    }
  }

  monitorVitalSigns(vitalSigns) {
    if (!vitalSigns) {
      return {
        isNormal: true,
        alerts: []
      };
    }

    const alerts = [];
    let isNormal = true;

    // Check heart rate
    if (vitalSigns.heartRate) {
      if (vitalSigns.heartRate > 180) {
        alerts.push('Heart rate too high - consider stopping');
        isNormal = false;
      } else if (vitalSigns.heartRate < 50) {
        alerts.push('Heart rate too low - check if you feel okay');
        isNormal = false;
      }
    }

    // Check breathing rate
    if (vitalSigns.breathingRate) {
      if (vitalSigns.breathingRate > 30) {
        alerts.push('Breathing rate elevated - take a break if needed');
        isNormal = false;
      }
    }

    return {
      isNormal,
      alerts
    };
  }

  processUserFeedback(userFeedback) {
    if (!userFeedback) {
      return {
        needsAttention: false,
        concerns: []
      };
    }

    const concerns = [];
    let needsAttention = false;

    // Check for pain reports
    if (userFeedback.pain) {
      concerns.push(`Pain reported: ${userFeedback.pain}`);
      needsAttention = true;
    }

    // Check for discomfort
    if (userFeedback.discomfort) {
      concerns.push(`Discomfort reported: ${userFeedback.discomfort}`);
      needsAttention = true;
    }

    // Check for fatigue
    if (userFeedback.fatigue) {
      concerns.push('User reports feeling fatigued');
      needsAttention = true;
    }

    return {
      needsAttention,
      concerns
    };
  }

  generateRealTimeAlerts(formAnalysis, vitalSigns, userFeedback) {
    const alerts = new Set();

    // Add form safety alerts
    const formSafety = this.assessFormSafety(formAnalysis);
    if (!formSafety.isSafe) {
      formSafety.issues.forEach(issue => alerts.add(issue));
    }

    // Add vital signs alerts
    const vitalSignsMonitoring = this.monitorVitalSigns(vitalSigns);
    if (!vitalSignsMonitoring.isNormal) {
      vitalSignsMonitoring.alerts.forEach(alert => alerts.add(alert));
    }

    // Add user feedback alerts
    const feedback = this.processUserFeedback(userFeedback);
    if (feedback.needsAttention) {
      feedback.concerns.forEach(concern => alerts.add(concern));
    }

    return Array.from(alerts);
  }

  async analyzePostWorkout(exerciseId, workoutData) {
    // Handle undefined workoutData
    if (!workoutData) {
      return {
        performance: {
          score: 0,
          metrics: {},
          insights: []
        },
        recovery: {
          status: 'unknown',
          metrics: {
            heartRateRecovery: 0,
            fatigueLevel: 0,
            muscleRecovery: 0
          },
          recommendations: []
        },
        recommendations: []
      };
    }

    const { performance = null, feedback = null, vitalSigns = null } = workoutData;
    
    return {
      performance: this.analyzePerformance(performance),
      recovery: this.assessRecovery(feedback, vitalSigns),
      recommendations: this.generatePostWorkoutRecommendations(performance, feedback, vitalSigns)
    };
  }

  analyzePerformance(performance) {
    if (!performance) {
      return {
        score: 0,
        metrics: {},
        insights: []
      };
    }

    const metrics = {
      formQuality: this.calculateFormQuality(performance),
      consistency: this.calculateConsistency(performance),
      endurance: this.calculateEndurance(performance),
      technique: this.calculateTechniqueScore(performance)
    };

    const insights = this.generatePerformanceInsights(metrics);
    const overallScore = this.calculateOverallPerformanceScore(metrics);

    return {
      score: overallScore,
      metrics,
      insights
    };
  }

  calculateFormQuality(performance) {
    if (!performance?.formData) return 0;

    const { alignment, stability, control } = performance.formData;
    return (alignment + stability + control) / 3;
  }

  calculateConsistency(performance) {
    if (!performance?.repetitions) return 0;

    const { count, quality } = performance.repetitions;
    if (count === 0) return 0;

    return quality / count;
  }

  calculateEndurance(performance) {
    if (!performance?.duration || !performance?.intensity) return 0;

    const { duration, intensity } = performance;
    return (duration * intensity) / 100;
  }

  calculateTechniqueScore(performance) {
    if (!performance?.technique) return 0;

    const { accuracy, precision, timing } = performance.technique;
    return (accuracy + precision + timing) / 3;
  }

  calculateOverallPerformanceScore(metrics) {
    const weights = {
      formQuality: 0.4,
      consistency: 0.3,
      endurance: 0.2,
      technique: 0.1
    };

    return Object.entries(metrics).reduce((score, [metric, value]) => {
      return score + (value * weights[metric]);
    }, 0);
  }

  generatePerformanceInsights(metrics) {
    const insights = [];

    // Form quality insights
    if (metrics.formQuality < 0.7) {
      insights.push('Focus on improving form quality in future sessions');
    } else if (metrics.formQuality > 0.9) {
      insights.push('Excellent form quality maintained throughout the workout');
    }

    // Consistency insights
    if (metrics.consistency < 0.6) {
      insights.push('Work on maintaining consistent performance across repetitions');
    } else if (metrics.consistency > 0.8) {
      insights.push('Great consistency in performance');
    }

    // Endurance insights
    if (metrics.endurance < 0.5) {
      insights.push('Consider gradually increasing workout duration');
    } else if (metrics.endurance > 0.8) {
      insights.push('Strong endurance demonstrated');
    }

    // Technique insights
    if (metrics.technique < 0.7) {
      insights.push('Focus on refining technique in future sessions');
    } else if (metrics.technique > 0.9) {
      insights.push('Excellent technique demonstrated');
    }

    return insights;
  }

  assessRecovery(feedback, vitalSigns) {
    const recoveryMetrics = {
      heartRateRecovery: this.calculateHeartRateRecovery(vitalSigns),
      fatigueLevel: this.assessFatigueLevel(feedback),
      muscleRecovery: this.assessMuscleRecovery(feedback)
    };

    return {
      status: this.determineRecoveryStatus(recoveryMetrics),
      metrics: recoveryMetrics,
      recommendations: this.generateRecoveryRecommendations(recoveryMetrics)
    };
  }

  calculateHeartRateRecovery(vitalSigns) {
    if (!vitalSigns?.heartRate || !vitalSigns?.restingHeartRate) return 0;

    const recoveryRate = (vitalSigns.heartRate - vitalSigns.restingHeartRate) / vitalSigns.restingHeartRate;
    return Math.max(0, 1 - recoveryRate);
  }

  assessFatigueLevel(feedback) {
    if (!feedback?.fatigue) return 0;

    const fatigueLevels = {
      none: 0,
      mild: 0.3,
      moderate: 0.6,
      severe: 0.9
    };

    return fatigueLevels[feedback.fatigue] || 0;
  }

  assessMuscleRecovery(feedback) {
    if (!feedback?.muscleSoreness) return 0;

    const sorenessLevels = {
      none: 0,
      mild: 0.3,
      moderate: 0.6,
      severe: 0.9
    };

    return 1 - (sorenessLevels[feedback.muscleSoreness] || 0);
  }

  determineRecoveryStatus(recoveryMetrics) {
    const { heartRateRecovery, fatigueLevel, muscleRecovery } = recoveryMetrics;
    const averageRecovery = (heartRateRecovery + (1 - fatigueLevel) + muscleRecovery) / 3;

    if (averageRecovery >= 0.8) return 'excellent';
    if (averageRecovery >= 0.6) return 'good';
    if (averageRecovery >= 0.4) return 'moderate';
    return 'needs_attention';
  }

  generateRecoveryRecommendations(recoveryMetrics) {
    const recommendations = [];

    if (recoveryMetrics.heartRateRecovery < 0.6) {
      recommendations.push('Allow more time for heart rate to return to normal');
    }

    if (recoveryMetrics.fatigueLevel > 0.7) {
      recommendations.push('Consider taking a longer rest period before next workout');
    }

    if (recoveryMetrics.muscleRecovery < 0.5) {
      recommendations.push('Focus on proper cool-down and stretching');
    }

    return recommendations;
  }

  generatePostWorkoutRecommendations(performance, feedback, vitalSigns) {
    const recommendations = [];

    // Performance-based recommendations
    if (performance) {
      const performanceAnalysis = this.analyzePerformance(performance);
      if (performanceAnalysis.score < 0.7) {
        recommendations.push('Consider reducing intensity in next session');
      }
    }

    // Recovery-based recommendations
    const recovery = this.assessRecovery(feedback, vitalSigns);
    recommendations.push(...recovery.recommendations);

    // Vital signs-based recommendations
    if (vitalSigns?.heartRate > 180) {
      recommendations.push('Monitor heart rate more closely in future sessions');
    }

    return [...new Set(recommendations)]; // Remove duplicates
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
      realTime: this.calculateRealTimeRisk(preWorkout.riskLevel, preWorkout.recommendations, realTime),
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

  calculateRealTimeRisk(userData, exerciseData, realTimeMetrics) {
    try {
      // Initialize risk score and factors
      let riskScore = 0;
      const riskFactors = [];
      const warnings = [];

      // Check heart rate
      if (realTimeMetrics.heartRate) {
        const maxHeartRate = 220 - userData.age;
        const heartRatePercentage = (realTimeMetrics.heartRate / maxHeartRate) * 100;
        
        if (heartRatePercentage > 90) {
          riskScore += 30;
          riskFactors.push('high_heart_rate');
          warnings.push('Heart rate is too high. Consider taking a break.');
        } else if (heartRatePercentage > 80) {
          riskScore += 15;
          riskFactors.push('elevated_heart_rate');
          warnings.push('Heart rate is elevated. Monitor your exertion level.');
        }
      }

      // Check form quality
      if (realTimeMetrics.formQuality) {
        if (realTimeMetrics.formQuality < 0.6) {
          riskScore += 25;
          riskFactors.push('poor_form');
          warnings.push('Form quality is poor. Consider adjusting your technique.');
        } else if (realTimeMetrics.formQuality < 0.8) {
          riskScore += 10;
          riskFactors.push('suboptimal_form');
          warnings.push('Form could be improved. Focus on proper technique.');
        }
      }

      // Check exercise intensity
      if (realTimeMetrics.intensity) {
        if (realTimeMetrics.intensity > 0.9) {
          riskScore += 20;
          riskFactors.push('high_intensity');
          warnings.push('Exercise intensity is very high. Consider reducing intensity.');
        } else if (realTimeMetrics.intensity > 0.7) {
          riskScore += 10;
          riskFactors.push('moderate_intensity');
        }
      }

      // Check for pain indicators
      if (realTimeMetrics.painLevel && realTimeMetrics.painLevel > 3) {
        riskScore += 35;
        riskFactors.push('pain_detected');
        warnings.push('Pain detected. Stop the exercise immediately.');
      }

      // Check for fatigue indicators
      if (realTimeMetrics.fatigueLevel && realTimeMetrics.fatigueLevel > 0.8) {
        riskScore += 15;
        riskFactors.push('high_fatigue');
        warnings.push('High fatigue level detected. Consider taking a rest.');
      }

      // Check for stability issues
      if (realTimeMetrics.stability && realTimeMetrics.stability < 0.7) {
        riskScore += 20;
        riskFactors.push('poor_stability');
        warnings.push('Stability issues detected. Focus on balance and control.');
      }

      // Calculate risk level
      let riskLevel = 'low';
      if (riskScore >= 70) {
        riskLevel = 'critical';
      } else if (riskScore >= 50) {
        riskLevel = 'high';
      } else if (riskScore >= 30) {
        riskLevel = 'moderate';
      }

      // Generate recommendations based on risk factors
      const recommendations = this.generateRealTimeRecommendations(riskFactors, exerciseData);

      return {
        riskScore,
        riskLevel,
        riskFactors,
        warnings,
        recommendations,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in calculateRealTimeRisk:', error);
      throw new Error('Failed to calculate real-time risk assessment');
    }
  }

  generateRealTimeRecommendations(riskFactors, exerciseData) {
    const recommendations = [];

    if (riskFactors.includes('high_heart_rate')) {
      recommendations.push({
        type: 'safety',
        priority: 'high',
        message: 'Take a break and allow your heart rate to return to a safe range.',
        action: 'rest'
      });
    }

    if (riskFactors.includes('poor_form')) {
      recommendations.push({
        type: 'technique',
        priority: 'high',
        message: `Focus on proper form for ${exerciseData.name}. Consider reducing weight or intensity.`,
        action: 'adjust_form'
      });
    }

    if (riskFactors.includes('pain_detected')) {
      recommendations.push({
        type: 'safety',
        priority: 'critical',
        message: 'Stop the exercise immediately and assess the source of pain.',
        action: 'stop'
      });
    }

    if (riskFactors.includes('high_fatigue')) {
      recommendations.push({
        type: 'recovery',
        priority: 'moderate',
        message: 'Take a short rest period to recover.',
        action: 'rest'
      });
    }

    if (riskFactors.includes('poor_stability')) {
      recommendations.push({
        type: 'technique',
        priority: 'moderate',
        message: 'Focus on maintaining proper balance and control.',
        action: 'adjust_form'
      });
    }

    return recommendations;
  }

  calculatePostWorkoutRisk(postWorkoutData) {
    try {
      // Initialize risk score and factors
      let riskScore = 0;
      const riskFactors = [];
      const warnings = [];

      // Check recovery status
      if (postWorkoutData.recovery) {
        const { status, metrics } = postWorkoutData.recovery;
        
        if (status === 'needs_attention') {
          riskScore += 30;
          riskFactors.push('poor_recovery');
          warnings.push('Recovery needs attention. Consider additional rest.');
        }

        // Check heart rate recovery
        if (metrics.heartRateRecovery < 0.6) {
          riskScore += 20;
          riskFactors.push('slow_heart_rate_recovery');
          warnings.push('Heart rate recovery is slower than expected.');
        }

        // Check fatigue levels
        if (metrics.fatigueLevel > 0.7) {
          riskScore += 15;
          riskFactors.push('high_fatigue');
          warnings.push('High fatigue levels detected post-workout.');
        }

        // Check muscle recovery
        if (metrics.muscleRecovery < 0.5) {
          riskScore += 25;
          riskFactors.push('poor_muscle_recovery');
          warnings.push('Muscle recovery is below optimal levels.');
        }
      }

      // Check performance metrics
      if (postWorkoutData.performance) {
        const { score, metrics } = postWorkoutData.performance;
        
        if (score < 0.6) {
          riskScore += 20;
          riskFactors.push('poor_performance');
          warnings.push('Workout performance was below expected levels.');
        }

        // Check form quality
        if (metrics.formQuality < 0.7) {
          riskScore += 15;
          riskFactors.push('poor_form_quality');
          warnings.push('Form quality was below optimal levels.');
        }

        // Check consistency
        if (metrics.consistency < 0.6) {
          riskScore += 10;
          riskFactors.push('inconsistent_performance');
          warnings.push('Exercise consistency needs improvement.');
        }
      }

      // Check for any reported pain or discomfort
      if (postWorkoutData.feedback) {
        if (postWorkoutData.feedback.pain) {
          riskScore += 35;
          riskFactors.push('pain_reported');
          warnings.push('Pain was reported during or after the workout.');
        }

        if (postWorkoutData.feedback.discomfort) {
          riskScore += 20;
          riskFactors.push('discomfort_reported');
          warnings.push('Discomfort was reported during or after the workout.');
        }
      }

      // Calculate risk level
      let riskLevel = 'low';
      if (riskScore >= 70) {
        riskLevel = 'critical';
      } else if (riskScore >= 50) {
        riskLevel = 'high';
      } else if (riskScore >= 30) {
        riskLevel = 'moderate';
      }

      // Generate recommendations based on risk factors
      const recommendations = this.generatePostWorkoutRecommendations(riskFactors, postWorkoutData);

      return {
        riskScore,
        riskLevel,
        riskFactors,
        warnings,
        recommendations,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in calculatePostWorkoutRisk:', error);
      throw new Error('Failed to calculate post-workout risk assessment');
    }
  }

  calculateCombinedRisk(risks) {
    try {
      const { preWorkout, realTime, postWorkout } = risks;
      
      // Initialize combined risk score and factors
      let combinedRiskScore = 0;
      const combinedRiskFactors = new Set();
      const combinedWarnings = new Set();
      
      // Weight factors for different stages
      const weights = {
        preWorkout: 0.3,
        realTime: 0.4,
        postWorkout: 0.3
      };

      // Process pre-workout risks
      if (preWorkout) {
        const preWorkoutScore = this.getRiskScoreFromLevel(preWorkout.level);
        combinedRiskScore += preWorkoutScore * weights.preWorkout;
        
        if (preWorkout.factors) {
          preWorkout.factors.forEach(factor => combinedRiskFactors.add(factor));
        }
        
        if (preWorkout.warnings) {
          preWorkout.warnings.forEach(warning => combinedWarnings.add(warning));
        }
      }

      // Process real-time risks
      if (realTime) {
        const realTimeScore = this.getRiskScoreFromLevel(realTime.riskLevel);
        combinedRiskScore += realTimeScore * weights.realTime;
        
        if (realTime.riskFactors) {
          realTime.riskFactors.forEach(factor => combinedRiskFactors.add(factor));
        }
        
        if (realTime.warnings) {
          realTime.warnings.forEach(warning => combinedWarnings.add(warning));
        }
      }

      // Process post-workout risks
      if (postWorkout) {
        const postWorkoutScore = this.getRiskScoreFromLevel(postWorkout.riskLevel);
        combinedRiskScore += postWorkoutScore * weights.postWorkout;
        
        if (postWorkout.riskFactors) {
          postWorkout.riskFactors.forEach(factor => combinedRiskFactors.add(factor));
        }
        
        if (postWorkout.warnings) {
          postWorkout.warnings.forEach(warning => combinedWarnings.add(warning));
        }
      }

      // Calculate overall risk level
      let overallRiskLevel = 'low';
      if (combinedRiskScore >= 70) {
        overallRiskLevel = 'critical';
      } else if (combinedRiskScore >= 50) {
        overallRiskLevel = 'high';
      } else if (combinedRiskScore >= 30) {
        overallRiskLevel = 'moderate';
      }

      // Generate combined recommendations
      const recommendations = this.generateCombinedRecommendations(
        Array.from(combinedRiskFactors),
        risks
      );

      return {
        riskScore: combinedRiskScore,
        riskLevel: overallRiskLevel,
        riskFactors: Array.from(combinedRiskFactors),
        warnings: Array.from(combinedWarnings),
        recommendations,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in calculateCombinedRisk:', error);
      throw new Error('Failed to calculate combined risk assessment');
    }
  }

  getRiskScoreFromLevel(riskLevel) {
    const riskScores = {
      critical: 80,
      high: 60,
      moderate: 40,
      low: 20
    };
    return riskScores[riskLevel] || 0;
  }

  generateCombinedRecommendations(riskFactors, risks) {
    const recommendations = [];
    const { preWorkout, realTime, postWorkout } = risks;

    // Add critical recommendations first
    if (riskFactors.includes('pain_detected') || riskFactors.includes('high_heart_rate')) {
      recommendations.push({
        type: 'safety',
        priority: 'critical',
        message: 'Immediate attention required. Consider stopping the workout and consulting a healthcare provider.',
        action: 'stop'
      });
    }

    // Add high priority recommendations
    if (riskFactors.includes('poor_recovery') || riskFactors.includes('poor_form')) {
      recommendations.push({
        type: 'technique',
        priority: 'high',
        message: 'Focus on proper form and recovery. Consider reducing intensity.',
        action: 'adjust'
      });
    }

    // Add moderate priority recommendations
    if (riskFactors.includes('high_fatigue') || riskFactors.includes('inconsistent_performance')) {
      recommendations.push({
        type: 'recovery',
        priority: 'moderate',
        message: 'Take additional rest periods and focus on consistency.',
        action: 'rest'
      });
    }

    // Add specific recommendations from each stage
    if (preWorkout?.recommendations) {
      recommendations.push(...preWorkout.recommendations);
    }
    if (realTime?.recommendations) {
      recommendations.push(...realTime.recommendations);
    }
    if (postWorkout?.recommendations) {
      recommendations.push(...postWorkout.recommendations);
    }

    // Remove duplicates and sort by priority
    return this.deduplicateAndSortRecommendations(recommendations);
  }

  deduplicateAndSortRecommendations(recommendations) {
    const priorityOrder = { critical: 0, high: 1, moderate: 2, low: 3 };
    const seen = new Set();
    
    return recommendations
      .filter(rec => {
        const key = `${rec.type}-${rec.message}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  calculateOverallScore(preWorkout, realTime, postWorkout) {
    try {
      // Initialize score components
      const scores = {
        preWorkout: this.calculatePreWorkoutScore(preWorkout),
        realTime: this.calculateRealTimeScore(realTime),
        postWorkout: this.calculatePostWorkoutScore(postWorkout)
      };

      // Weight factors for different stages
      const weights = {
        preWorkout: 0.3,
        realTime: 0.4,
        postWorkout: 0.3
      };

      // Calculate weighted average
      const overallScore = Object.entries(scores).reduce((total, [stage, score]) => {
        return total + (score * weights[stage]);
      }, 0);

      return {
        overall: overallScore,
        components: scores
      };
    } catch (error) {
      console.error('Error in calculateOverallScore:', error);
      throw new Error('Failed to calculate overall safety score');
    }
  }

  calculatePreWorkoutScore(preWorkout) {
    if (!preWorkout) return 0;
    
    const { riskLevel } = preWorkout;
    const riskScores = {
      critical: 0.2,
      high: 0.4,
      medium: 0.6,
      low: 0.8
    };

    return riskScores[riskLevel.level] || 0.5;
  }

  calculateRealTimeScore(realTime) {
    if (!realTime) return 0;

    let score = 1.0;

    // Deduct points for each risk factor
    if (realTime.riskFactors) {
      const deductions = {
        high_heart_rate: 0.3,
        poor_form: 0.2,
        high_intensity: 0.2,
        pain_detected: 0.4,
        high_fatigue: 0.15,
        poor_stability: 0.2
      };

      realTime.riskFactors.forEach(factor => {
        score -= (deductions[factor] || 0.1);
      });
    }

    return Math.max(0, score);
  }

  calculatePostWorkoutScore(postWorkout) {
    if (!postWorkout) return 0;

    let score = 1.0;

    // Deduct points based on recovery status
    if (postWorkout.recovery) {
      const { status, metrics } = postWorkout.recovery;
      
      if (status === 'needs_attention') {
        score -= 0.3;
      }

      if (metrics.heartRateRecovery < 0.6) {
        score -= 0.2;
      }

      if (metrics.fatigueLevel > 0.7) {
        score -= 0.15;
      }

      if (metrics.muscleRecovery < 0.5) {
        score -= 0.25;
      }
    }

    return Math.max(0, score);
  }

  getScoreBreakdown(preWorkout, realTime, postWorkout) {
    return {
      preWorkout: {
        score: this.calculatePreWorkoutScore(preWorkout),
        factors: preWorkout?.riskLevel?.factors || []
      },
      realTime: {
        score: this.calculateRealTimeScore(realTime),
        factors: realTime?.riskFactors || []
      },
      postWorkout: {
        score: this.calculatePostWorkoutScore(postWorkout),
        factors: postWorkout?.riskFactors || []
      }
    };
  }

  getImmediateRecommendations(realTime) {
    if (!realTime?.recommendations) return [];
    
    return realTime.recommendations
      .filter(rec => rec.priority === 'critical' || rec.priority === 'high')
      .map(rec => ({
        ...rec,
        timestamp: new Date().toISOString()
      }));
  }

  getShortTermRecommendations(postWorkout) {
    if (!postWorkout?.recommendations) return [];
    
    return postWorkout.recommendations
      .filter(rec => rec.priority === 'moderate')
      .map(rec => ({
        ...rec,
        timestamp: new Date().toISOString()
      }));
  }

  getLongTermRecommendations(preWorkout, postWorkout) {
    const recommendations = [];
    
    if (preWorkout?.recommendations) {
      recommendations.push(...preWorkout.recommendations);
    }
    
    if (postWorkout?.recommendations) {
      recommendations.push(...postWorkout.recommendations);
    }
    
    return recommendations
      .filter(rec => rec.priority === 'low')
      .map(rec => ({
        ...rec,
        timestamp: new Date().toISOString()
      }));
  }
}

export const safetyMonitoringService = new SafetyMonitoringService(); 