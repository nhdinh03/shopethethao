class UserHistorySSEService {
  constructor() {
    this.authEventSource = null;
    this.adminEventSource = null;
  }

  subscribeToAuthActivities(callback) {
    this.authEventSource = new EventSource('http://localhost:8081/api/userhistory/sse/auth-activities');
    
    this.authEventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    this.authEventSource.onerror = (error) => {
      console.error('Auth SSE Error:', error);
      this.authEventSource.close();
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.subscribeToAuthActivities(callback), 5000);
    };

    return () => {
      if (this.authEventSource) {
        this.authEventSource.close();
      }
    };
  }

  subscribeToAdminActivities(callback) {
    this.adminEventSource = new EventSource('http://localhost:8081/api/userhistory/sse/admin-activities');
    
    this.adminEventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    this.adminEventSource.onerror = (error) => {
      console.error('Admin SSE Error:', error);
      this.adminEventSource.close();
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.subscribeToAdminActivities(callback), 5000);
    };

    return () => {
      if (this.adminEventSource) {
        this.adminEventSource.close();
      }
    };
  }
}

export const userHistorySSE = new UserHistorySSEService();
