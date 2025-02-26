class UserHistorySSEService {
  constructor() {
    this.authEventSource = null;
    this.adminEventSource = null;
    this.reconnectAttempt = 0;
    this.maxReconnectAttempts = 5;
    this.baseReconnectDelay = 1000; // Start with 1s delay
    this.reconnectTimeouts = {};
    this.lastAuthData = null;
    this.lastAdminData = null;
    this.isAuthConnecting = false;
    this.isAdminConnecting = false;
    this.callbacks = {
      auth: [],
      admin: [],
    };
  }

  subscribeToAuthActivities(callback) {
    // Add the callback to the list
    this.callbacks.auth.push(callback);

    // If we already have data and a connection is in progress, send it immediately
    if (this.lastAuthData && callback) {
      setTimeout(() => callback(this.lastAuthData), 0);
    }

    // Only create a new connection if one doesn't exist
    if (!this.authEventSource && !this.isAuthConnecting) {
      this.connectToAuthStream();
    }

    // Return unsubscribe function
    return () => {
      this.callbacks.auth = this.callbacks.auth.filter((cb) => cb !== callback);

      // If no more callbacks, close the connection
      if (this.callbacks.auth.length === 0) {
        this.closeAuthConnection();
      }
    };
  }

  subscribeToAdminActivities(callback) {
    // Add the callback to the list
    this.callbacks.admin.push(callback);

    // If we already have data and a connection is in progress, send it immediately
    if (this.lastAdminData && callback) {
      setTimeout(() => callback(this.lastAdminData), 0);
    }

    // Only create a new connection if one doesn't exist
    if (!this.adminEventSource && !this.isAdminConnecting) {
      this.connectToAdminStream();
    }

    // Return unsubscribe function
    return () => {
      this.callbacks.admin = this.callbacks.admin.filter(
        (cb) => cb !== callback
      );

      // If no more callbacks, close the connection
      if (this.callbacks.admin.length === 0) {
        this.closeAdminConnection();
      }
    };
  }

  connectToAuthStream() {
    this.isAuthConnecting = true;

    // Updated URL to use the new endpoint
    const url = new URL(
      "http://localhost:8081/api/userhistory-sse/stream/auth-activities"
    );
    url.searchParams.append("t", Date.now()); // Cache busting

    try {
      this.authEventSource = new EventSource(url);

      this.authEventSource.onopen = () => {
        // console.log('Auth SSE connection established');
        this.reconnectAttempt = 0; // Reset reconnect counter on successful connection
        this.isAuthConnecting = false;
      };

      this.authEventSource.addEventListener("AUTH_ACTIVITY", (event) => {
        try {
          const data = JSON.parse(event.data);
          // Preserve locally marked read status
          if (this.lastAuthData && data.content) {
            data.content = this.mergeReadStatus(
              this.lastAuthData.content,
              data.content
            );
          }
          this.lastAuthData = data;

          // Notify all callbacks
          this.callbacks.auth.forEach((callback) => callback(data));
        } catch (error) {
          console.error("Error parsing AUTH_ACTIVITY event data:", error);
        }
      });

      this.authEventSource.addEventListener("HEARTBEAT", (event) => {
        // console.debug('Auth SSE heartbeat received:', event.lastEventId);
      });

      this.authEventSource.addEventListener("INIT", (event) => {
        // console.log('Auth SSE initialized:', event.data);
      });

      this.authEventSource.onerror = (error) => {
        // console.error('Auth SSE Error:', error);
        this.isAuthConnecting = false;

        if (this.authEventSource) {
          this.authEventSource.close();
          this.authEventSource = null;
        }

        // Implement exponential backoff for reconnection
        if (this.reconnectAttempt < this.maxReconnectAttempts) {
          const delay = this.calculateReconnectDelay();
          // console.log(`Auth SSE reconnecting in ${delay}ms (attempt ${this.reconnectAttempt + 1}/${this.maxReconnectAttempts})`);

          this.reconnectTimeouts.auth = setTimeout(() => {
            this.reconnectAttempt++;
            this.connectToAuthStream();
          }, delay);
        } else {
          console.error("Max reconnection attempts reached for auth SSE");
        }
      };
    } catch (error) {
      console.error("Error creating Auth SSE connection:", error);
      this.isAuthConnecting = false;
    }
  }

  connectToAdminStream() {
    this.isAdminConnecting = true;

    // Updated URL to use the new endpoint
    const url = new URL(
      "http://localhost:8081/api/userhistory-sse/stream/admin-activities"
    );
    url.searchParams.append("t", Date.now()); // Cache busting

    try {
      this.adminEventSource = new EventSource(url);

      this.adminEventSource.onopen = () => {
        // console.log('Admin SSE connection established');
        this.reconnectAttempt = 0; // Reset reconnect counter on successful connection
        this.isAdminConnecting = false;
      };

      this.adminEventSource.addEventListener("ADMIN_ACTIVITY", (event) => {
        try {
          const data = JSON.parse(event.data);
          // Preserve locally marked read status
          if (this.lastAdminData && data.content) {
            data.content = this.mergeReadStatus(
              this.lastAdminData.content,
              data.content
            );
          }
          this.lastAdminData = data;

          // Notify all callbacks
          this.callbacks.admin.forEach((callback) => callback(data));
        } catch (error) {
          console.error("Error parsing ADMIN_ACTIVITY event data:", error);
        }
      });

      this.adminEventSource.addEventListener("HEARTBEAT", (event) => {
        // console.debug('Admin SSE heartbeat received:', event.lastEventId);
      });

      this.adminEventSource.addEventListener("INIT", (event) => {
        // console.log('Admin SSE initialized:', event.data);
      });

      this.adminEventSource.onerror = (error) => {
        // console.error('Admin SSE Error:', error);
        this.isAdminConnecting = false;

        if (this.adminEventSource) {
          this.adminEventSource.close();
          this.adminEventSource = null;
        }

        // Implement exponential backoff for reconnection
        if (this.reconnectAttempt < this.maxReconnectAttempts) {
          const delay = this.calculateReconnectDelay();
          // console.log(`Admin SSE reconnecting in ${delay}ms (attempt ${this.reconnectAttempt + 1}/${this.maxReconnectAttempts})`);

          this.reconnectTimeouts.admin = setTimeout(() => {
            this.reconnectAttempt++;
            this.connectToAdminStream();
          }, delay);
        } else {
          console.error("Max reconnection attempts reached for admin SSE");
        }
      };
    } catch (error) {
      console.error("Error creating Admin SSE connection:", error);
      this.isAdminConnecting = false;
    }
  }

  // Helper method to preserve read status when new data comes in
  mergeReadStatus(oldItems = [], newItems = []) {
    return newItems.map((newItem) => {
      // Find matching item in old data
      const oldItem = oldItems.find(
        (item) => item.idHistory === newItem.idHistory
      );
      // If old item exists and was marked as read, preserve that status
      if (oldItem && oldItem.readStatus === 1) {
        return { ...newItem, readStatus: 1 };
      }
      return newItem;
    });
  }

  calculateReconnectDelay() {
    // Exponential backoff with jitter
    const expBackoff = Math.min(
      30000,
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempt)
    );
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
