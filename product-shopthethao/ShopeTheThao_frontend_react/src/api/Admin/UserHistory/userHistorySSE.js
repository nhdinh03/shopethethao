class UserHistorySSEService {
  constructor() {
    this.authEventSource = null;
    this.adminEventSource = null;
    this.reconnectAttempt = 0;
    this.maxReconnectAttempts = 5;
    this.baseReconnectDelay = 1000;
    this.reconnectTimeouts = {};
    this.lastAuthData = null;
    this.lastAdminData = null;
    this.isAuthConnecting = false;
    this.isAdminConnecting = false;
    this.callbacks = {
      auth: [],
      admin: [],
    };

    window.addEventListener("beforeunload", () => {
      this.closeAllConnections();
    });
  }

  subscribeToAuthActivities(callback) {
    this.callbacks.auth.push(callback);
    if (this.lastAuthData) {
      setTimeout(() => callback(this.lastAuthData), 0);
    }
    if (!this.authEventSource && !this.isAuthConnecting) {
      this.connectToAuthStream();
    }
    return () => {
      this.callbacks.auth = this.callbacks.auth.filter((cb) => cb !== callback);
      if (this.callbacks.auth.length === 0) {
        this.closeAuthConnection();
      }
    };
  }

  subscribeToAdminActivities(callback) {
    this.callbacks.admin.push(callback);
    if (this.lastAdminData) {
      setTimeout(() => callback(this.lastAdminData), 0);
    }
    if (!this.adminEventSource && !this.isAdminConnecting) {
      this.connectToAdminStream();
    }
    return () => {
      this.callbacks.admin = this.callbacks.admin.filter((cb) => cb !== callback);
      if (this.callbacks.admin.length === 0) {
        this.closeAdminConnection();
      }
    };
  }

  connectToAuthStream() {
    if (this.isAuthConnecting) return;
    this.isAuthConnecting = true;

    const url = new URL("http://localhost:8081/api/userhistory-sse/stream/auth-activities");
    url.searchParams.append("t", Date.now());

    this.authEventSource = new EventSource(url);

    this.authEventSource.onopen = () => {
      console.debug("Auth SSE connection established");
      this.reconnectAttempt = 0;
      this.isAuthConnecting = false;
    };

    this.authEventSource.addEventListener("AUTH_ACTIVITY", (event) => {
      try {
        const data = JSON.parse(event.data);
        this.lastAuthData = this.mergeReadStatus(this.lastAuthData?.content, data.content);
        this.callbacks.auth.forEach((cb) => cb(data));
      } catch (error) {
        console.error("Error parsing AUTH_ACTIVITY:", error);
      }
    });

    this.authEventSource.addEventListener("HEARTBEAT", () => {
      console.debug("Auth SSE heartbeat received");
    });

    this.authEventSource.onerror = () => {
      console.debug("Auth SSE connection lost");
      this.handleReconnect("auth", this.connectToAuthStream.bind(this));
    };
  }

  connectToAdminStream() {
    if (this.isAdminConnecting) return;
    this.isAdminConnecting = true;

    const url = new URL("http://localhost:8081/api/userhistory-sse/stream/admin-activities");
    url.searchParams.append("t", Date.now());

    this.adminEventSource = new EventSource(url);

    this.adminEventSource.onopen = () => {
      console.debug("Admin SSE connection established");
      this.reconnectAttempt = 0;
      this.isAdminConnecting = false;
    };

    this.adminEventSource.addEventListener("ADMIN_ACTIVITY", (event) => {
      try {
        const data = JSON.parse(event.data);
        this.lastAdminData = this.mergeReadStatus(this.lastAdminData?.content, data.content);
        this.callbacks.admin.forEach((cb) => cb(data));
      } catch (error) {
        console.error("Error parsing ADMIN_ACTIVITY:", error);
      }
    });

    this.adminEventSource.addEventListener("HEARTBEAT", () => {
      console.debug("Admin SSE heartbeat received");
    });

    this.adminEventSource.onerror = () => {
      console.debug("Admin SSE connection lost");
      this.handleReconnect("admin", this.connectToAdminStream.bind(this));
    };
  }

  handleReconnect(type, reconnectFn) {
    this[`${type}EventSource`]?.close();
    this[`${type}EventSource`] = null;
    this[`is${type.charAt(0).toUpperCase() + type.slice(1)}Connecting`] = false;

    if (this.reconnectAttempt < this.maxReconnectAttempts) {
      const delay = this.calculateReconnectDelay();
      console.debug(`Reconnecting ${type} SSE in ${delay}ms (attempt ${this.reconnectAttempt + 1})`);
      this.reconnectTimeouts[type] = setTimeout(() => {
        this.reconnectAttempt++;
        reconnectFn();
      }, delay);
    } else {
      console.error(`Max reconnect attempts reached for ${type} SSE`);
    }
  }

  mergeReadStatus(oldItems = [], newItems = []) {
    return newItems.map((newItem) => {
      const oldItem = oldItems.find((item) => item.idHistory === newItem.idHistory);
      return oldItem?.readStatus === 1 ? { ...newItem, readStatus: 1 } : newItem;
    });
  }

  calculateReconnectDelay() {
    const expBackoff = Math.min(30000, this.baseReconnectDelay * Math.pow(2, this.reconnectAttempt));
    const jitter = expBackoff * 0.2 * (Math.random() * 2 - 1);
    return Math.floor(expBackoff + jitter);
  }

  closeAuthConnection() {
    if (this.authEventSource) {
      this.authEventSource.close();
      this.authEventSource = null;
      console.debug("Auth SSE connection closed");
    }
    clearTimeout(this.reconnectTimeouts.auth);
    this.reconnectTimeouts.auth = null;
  }

  closeAdminConnection() {
    if (this.adminEventSource) {
      this.adminEventSource.close();
      this.adminEventSource = null;
      console.debug("Admin SSE connection closed");
    }
    clearTimeout(this.reconnectTimeouts.admin);
    this.reconnectTimeouts.admin = null;
  }

  closeAllConnections() {
    this.closeAuthConnection();
    this.closeAdminConnection();
  }
}


export const userHistorySSE = new UserHistorySSEService();
