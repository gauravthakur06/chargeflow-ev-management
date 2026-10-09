import LiveClock from "./LiveClock";

export default function Header({ onNewSession, darkMode, setDarkMode }) {
  return (
    <header className="header">
      <div>
        <p className="small-title">EV CHARGING OPERATIONS</p>
        <h1>ChargeFlow</h1>
        <p className="subtitle">
          Smart EV Charging Network Dashboard
        </p>
      </div>

      <div className="header-right">

        <button
          className="theme-button"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        <LiveClock />

        <button
          className="primary-button"
          onClick={onNewSession}
        >
          + Start Session
        </button>

      </div>
    </header>
  );
}