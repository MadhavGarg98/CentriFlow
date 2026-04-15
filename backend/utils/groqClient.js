const axios = require('axios');

class GroqClient {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.baseURL = 'https://api.groq.com/openai/v1';
    this.model = 'llama3-70b-8192';
    this.fallbackModel = 'mixtral-8x7b-32768';

    if (!this.apiKey) {
      console.warn('GROQ_API_KEY not found in environment variables');
    }
  }

  async sendMessage(messages, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: options.model || this.model,
          messages: messages,
          max_tokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
          stream: options.stream || false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: options.timeout || 30000
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Groq API Error:', error.response?.data || error.message);
      
      // Try fallback model if primary model fails
      if (options.model !== this.fallbackModel && error.response?.status === 400) {
        console.log('Trying fallback model...');
        return this.sendMessage(messages, { ...options, model: this.fallbackModel });
      }

      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  async generateResponse(prompt, context = {}) {
    const systemMessage = {
      role: 'system',
      content: `You are an intelligent ERP assistant for a college education system.
You help students understand their attendance, performance, and schedule.
Always give clear, short, and helpful answers.
Be encouraging and supportive in your responses.

Context Information:
- Student Name: ${context.userName || 'Student'}
- Role: ${context.role || 'student'}
- Attendance: ${context.attendancePercentage || 'N/A'}%
- Risk Level: ${context.riskLevel || 'N/A'}
- Total Classes: ${context.totalClasses || 'N/A'}
- Present Classes: ${context.presentClasses || 'N/A'}

Use this context to provide personalized and accurate responses.`
    };

    const userMessage = {
      role: 'user',
      content: prompt
    };

    const messages = [systemMessage, userMessage];

    try {
      const response = await this.sendMessage(messages);
      
      if (response.success) {
        return {
          success: true,
          response: response.data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.'
        };
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Groq generation error:', error);
      
      // Return fallback response
      return {
        success: true,
        response: this.getFallbackResponse(prompt, context)
      };
    }
  }

  getFallbackResponse(prompt, context) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('attendance')) {
      return `Your current attendance is ${context.attendancePercentage || 'N/A'}% (${context.presentClasses || 0}/${context.totalClasses || 0} classes). ${context.attendancePercentage >= 75 ? 'Keep up the good work!' : 'Try to improve your attendance for better academic performance.'}`;
    }
    
    if (lowerPrompt.includes('performance') || lowerPrompt.includes('risk')) {
      const riskAdvice = {
        'low': 'You\'re performing well! Keep maintaining your current attendance and study habits.',
        'medium': 'You\'re at moderate risk. Focus on improving attendance and seeking help when needed.',
        'high': 'You need immediate attention. Please meet with your academic advisor and create an improvement plan.'
      };
      
      return `Your current risk level is ${context.riskLevel || 'N/A'}. ${riskAdvice[context.riskLevel] || 'Focus on consistent attendance and study habits.'}`;
    }
    
    if (lowerPrompt.includes('help') || lowerPrompt.includes('recommendation')) {
      return context.recommendations?.[0] || 'Keep maintaining good attendance and study habits. Don\'t hesitate to ask for help when you need it.';
    }
    
    return 'I\'m here to help you with your academic performance and attendance. You can ask about your attendance status, performance metrics, or get personalized recommendations.';
  }

  async generatePrediction(studentData) {
    const prompt = `Based on the following student data, provide a comprehensive academic risk assessment and prediction:

Student Information:
- Name: ${studentData.name}
- Attendance Percentage: ${studentData.attendancePercentage}%
- Total Classes: ${studentData.totalClasses}
- Present Classes: ${studentData.presentClasses}
- Average Grades: ${studentData.averageGrades}
- Recent Attendance Trend: ${studentData.recentAttendance?.map(a => a.status).join(', ')}

Please analyze and provide:
1. Risk Level (low/medium/high)
2. Risk Score (0-100)
3. Dropout Risk Percentage
4. Performance Prediction (0-100)
5. Performance Trend (improving/stable/declining)
6. 3-4 Specific Recommendations

Respond in JSON format with these exact keys: riskLevel, riskScore, dropoutRisk, performancePrediction, performanceTrend, recommendations`;

    try {
      const response = await this.sendMessage([
        {
          role: 'system',
          content: 'You are an AI assistant that analyzes student performance data and provides risk assessments. Always respond in valid JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        temperature: 0.3,
        maxTokens: 1500
      });

      if (response.success) {
        const content = response.data.choices[0]?.message?.content;
        
        try {
          // Parse JSON response
          const prediction = JSON.parse(content);
          return {
            success: true,
            prediction
          };
        } catch (parseError) {
          console.error('Failed to parse AI prediction as JSON:', parseError);
          // Return structured fallback
          return this.getFallbackPrediction(studentData);
        }
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Prediction generation error:', error);
      return this.getFallbackPrediction(studentData);
    }
  }

  getFallbackPrediction(studentData) {
    const attendancePercentage = studentData.attendancePercentage || 0;
    
    // Calculate risk based on attendance
    let riskLevel, riskScore, dropoutRisk;
    
    if (attendancePercentage >= 75) {
      riskLevel = 'low';
      riskScore = Math.max(0, 100 - attendancePercentage);
      dropoutRisk = Math.max(0, (100 - attendancePercentage) * 0.3);
    } else if (attendancePercentage >= 50) {
      riskLevel = 'medium';
      riskScore = Math.max(40, 100 - attendancePercentage);
      dropoutRisk = Math.max(30, (100 - attendancePercentage) * 0.5);
    } else {
      riskLevel = 'high';
      riskScore = Math.max(70, 100 - attendancePercentage);
      dropoutRisk = Math.max(60, (100 - attendancePercentage) * 0.7);
    }

    const performancePrediction = Math.min(100, attendancePercentage + 10);
    
    // Determine trend based on recent attendance
    let performanceTrend = 'stable';
    if (studentData.recentAttendance && studentData.recentAttendance.length >= 5) {
      const recentPresent = studentData.recentAttendance.slice(-5).filter(a => a.status === 'present').length;
      const recentRate = recentPresent / 5;
      
      if (recentRate > 0.8) performanceTrend = 'improving';
      else if (recentRate < 0.6) performanceTrend = 'declining';
    }

    const recommendations = [];
    if (attendancePercentage < 60) {
      recommendations.push('Critical: Attendance is below minimum requirements - immediate intervention needed');
    }
    if (attendancePercentage < 75) {
      recommendations.push('Focus on improving attendance to enhance academic performance');
      recommendations.push('Consider joining study groups for better engagement');
    }
    if (attendancePercentage >= 75) {
      recommendations.push('Maintain current excellent attendance level');
      recommendations.push('Consider helping peers who may be struggling');
    }

    return {
      success: true,
      prediction: {
        riskLevel,
        riskScore: Math.round(riskScore),
        dropoutRisk: Math.round(dropoutRisk),
        performancePrediction: Math.round(performancePrediction),
        performanceTrend,
        recommendations
      }
    };
  }
}

module.exports = new GroqClient();
