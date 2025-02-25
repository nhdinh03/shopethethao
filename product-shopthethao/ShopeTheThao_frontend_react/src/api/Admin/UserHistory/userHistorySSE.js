class UserHistorySSEService {
  constructor() {
    this.authEventSource = null;
    this.adminEventSource = null;
    this.reconnectAttempt = 0;
    this.maxReconnectAttempts = 5;
    this.baseReconnectDelay = 1000; // Start with 1s delay
    this.reconnectTimeouts = {};
  }

  subscribeToAuthActivities(callback) {
    this.closeAuthConnection(); // Close existing connection if any
    
    const url = new URL('http://localhost:8081/api/userhistory/sse/auth-activities');
    url.searchParams.append('t', Date.now()); // Cache busting
    
    this.authEventSource = new EventSource(url);
    
    this.authEventSource.onopen = () => {
      console.log('Auth SSE connection established');
      this.reconnectAttempt = 0; // Reset reconnect counter on successful connection
    };
    
    this.authEventSource.addEventListener('AUTH_ACTIVITY', (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Error parsing AUTH_ACTIVITY event data:', error);
      }
    });
    
    this.authEventSource.addEventListener('HEARTBEAT', (event) => {
      console.debug('Auth SSE heartbeat received:', event.lastEventId);
    });
    
    this.authEventSource.addEventListener('INIT', (event) => {
      console.log('Auth SSE initialized:', event.data);
    });
    
    this.authEventSource.onerror = (error) => {
      console.error('Auth SSE Error:', error);
      this.authEventSource.close();
      
      // Implement exponential backoff for reconnection
      if (this.reconnectAttempt < this.maxReconnectAttempts) {
        const delay = this.calculateReconnectDelay();
        console.log(`Auth SSE reconnecting in ${delay}ms (attempt ${this.reconnectAttempt + 1}/${this.maxReconnectAttempts})`);
        
        this.reconnectTimeouts.auth = setTimeout(() => {
          this.reconnectAttempt++;
          this.subscribeToAuthActivities(callback);
        }, delay);
      } else {
        console.error('Max reconnection attempts reached for auth SSE');
      }
    };

    return () => this.closeAuthConnection();
  }

  subscribeToAdminActivities(callback) {
    this.closeAdminConnection(); // Close existing connection if any
    
    const url = new URL('http://localhost:8081/api/userhistory/sse/admin-activities');
    url.searchParams.append('t', Date.now()); // Cache busting
    
    this.adminEventSource = new EventSource(url);
    
    this.adminEventSource.onopen = () => {
      console.log('Admin SSE connection established');
      this.reconnectAttempt = 0; // Reset reconnect counter on successful connection
    };
    
    this.adminEventSource.addEventListener('ADMIN_ACTIVITY', (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Error parsing ADMIN_ACTIVITY event data:', error);
      }
    });
    
    this.adminEventSource.addEventListener('HEARTBEAT', (event) => {
      console.debug('Admin SSE heartbeat received:', event.lastEventId);
    });
    
    this.adminEventSource.addEventListener('INIT', (event) => {
      console.log('Admin SSE initialized:', event.data);
    });
    
    this.adminEventSource.onerror = (error) => {
      console.error('Admin SSE Error:', error);
      this.adminEventSource.close();
      
      // Implement exponential backoff for reconnection
      if (this.reconnectAttempt < this.maxReconnectAttempts) {
        const delay = this.calculateReconnectDelay();
        console.log(`Admin SSE reconnecting in ${delay}ms (attempt ${this.reconnectAttempt + 1}/${this.maxReconnectAttempts})`);
        
        this.reconnectTimeouts.admin = setTimeout(() => {
          this.reconnectAttempt++;
          this.subscribeToAdminActivities(callback);
        }, delay);
      } else {
        console.error('Max reconnection attempts reached for admin SSE');
      }
    };

    return () => this.closeAdminConnection();
  }

  calculateReconnectDelay() {
    // Exponential backoff with jitter
    const expBackoff = Math.min(30000, this.baseReconnectDelay * Math.pow(2, this.reconnectAttempt));
    // Add random jitter (±20%)
    const jitter = expBackoff * 0.2 * (Math.random() * 2 - 1);
    return Math.floor(expBackoff + jitter);
  }

  closeAuthConnection() {
    if (this.authEventSource) {
      this.authEventSource.close();
      this.authEventSource = null;
    }
    
    if (this.reconnectTimeouts.auth) {
      clearTimeout(this.reconnectTimeouts.auth);
      this.reconnectTimeouts.auth = null;
    }
  }

  closeAdminConnection() {
    if (this.adminEventSource) {
      this.adminEventSource.close();
      this.adminEventSource = null;
    }
    
    if (this.reconnectTimeouts.admin) {
      clearTimeout(this.reconnectTimeouts.admin);
      this.reconnectTimeouts.admin = null;
    }
  }
  
  closeAllConnections() {
    this.closeAuthConnection();
    this.closeAdminConnection();
  }
}

export const userHistorySSE = new UserHistorySSEService();
