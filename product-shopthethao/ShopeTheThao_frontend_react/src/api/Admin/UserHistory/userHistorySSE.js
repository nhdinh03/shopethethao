class UserHistorySSE {
  constructor() {
    this.authEventsSource = null;
    this.adminEventsSource = null;
    this.retryCount = 0;
    this.maxRetries = 3;
    this.retryTimeout = 1000; // 5 seconds
  }

  connectWithRetry(url, callback, type) {
    if (this.retryCount >= this.maxRetries) {
      console.error(`Max retries (${this.maxRetries}) reached for ${type} SSE connection`);
      return null;
    }

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
        this.retryCount = 0; // Reset retry count on successful connection
      } catch (error) {
        console.error(`Error parsing ${type} SSE data:`, error);
      }
    };

    eventSource.onerror = (error) => {
      console.error(`${type} SSE Error:`, error);
      eventSource.close();
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying ${type} SSE connection in ${this.retryTimeout / 1000}s... (Attempt ${this.retryCount}/${this.maxRetries})`);
        setTimeout(() => {
          this[type === 'auth' ? 'authEventsSource' : 'adminEventsSource'] = 
            this.connectWithRetry(url, callback, type);
        }, this.retryTimeout);
      }
    };

    return eventSource;
  }

  subscribeToAuthActivities(callback) {
    if (this.authEventsSource) {
      this.authEventsSource.close();
    }

    this.authEventsSource = this.connectWithRetry(
      'http://localhost:8081/api/userhistory/auth-activities/stream',
      callback,
      'auth'
    );

    return () => {
      if (this.authEventsSource) {
        this.authEventsSource.close();
        this.authEventsSource = null;
      }
    };
  }

  subscribeToAdminActivities(callback) {
    if (this.adminEventsSource) {
      this.adminEventsSource.close();
    }

    this.adminEventsSource = this.connectWithRetry(
      'http://localhost:8081/api/userhistory/admin-activities/stream',
      callback,
      'admin'
    );

    return () => {
      if (this.adminEventsSource) {
        this.adminEventsSource.close();
        this.adminEventsSource = null;
      }
    };
  }

  closeAllConnections() {
    if (this.authEventsSource) {
      this.authEventsSource.close();
      this.authEventsSource = null;
    }
    if (this.adminEventsSource) {
      this.adminEventsSource.close();
      this.adminEventsSource = null;
    }
    this.retryCount = 0;
  }
}

export const userHistorySSE = new UserHistorySSE();
