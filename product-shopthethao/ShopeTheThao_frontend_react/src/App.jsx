const styles = {
  app: {
    textAlign: "center",
  },
  appLogo: {
    height: "40vmin",
    pointerEvents: "none",
    animation: window.matchMedia("(prefers-reduced-motion: no-preference)").matches
      ? "App-logo-spin infinite 20s linear"
      : "none",
  },
  appHeader: {
    backgroundColor: "#282c34",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
  },
  appLink: {
    color: "#61dafb",
  },
};

const App = () => (
  <div style={styles.app}>
    <header style={styles.appHeader}>
      <img
        src="logo.png"
        className="App-logo"
        alt="logo"
        style={styles.appLogo}
      />
      <p>Edit <code>src/App.js</code> and save to reload.</p>
      <a
        style={styles.appLink}
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);
