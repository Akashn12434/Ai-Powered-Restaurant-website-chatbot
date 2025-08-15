class AIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    this.sessionId = localStorage.getItem('ai_session_id');
  }

  async sendMessage(message) {
    try {
      const response = await fetch(`${this.baseURL}/api/ai/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          session_id: this.sessionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Store session ID for future requests
      if (data.session_id && !this.sessionId) {
        this.sessionId = data.session_id;
        localStorage.setItem('ai_session_id', data.session_id);
      }

      return data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async getQuickOptions() {
    try {
      const response = await fetch(`${this.baseURL}/api/ai/quick-options/`);
      if (!response.ok) {
        throw new Error('Failed to load quick options');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading quick options:', error);
      return { options: [] };
    }
  }

  async getChatHistory() {
    if (!this.sessionId) return { history: [] };

    try {
      const response = await fetch(`${this.baseURL}/api/ai/history/?session_id=${this.sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to load chat history');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading chat history:', error);
      return { history: [] };
    }
  }

  clearSession() {
    this.sessionId = null;
    localStorage.removeItem('ai_session_id');
  }
}

export default new AIService();