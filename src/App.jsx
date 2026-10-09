import { useEffect, useState, useRef } from 'react'

const vehicles = [
  'BMW i4 · B-EL 4821',
  'Tesla Model 3 · B-TM 2901',
  'Volkswagen ID.4 · B-RV 1172',
  'Mercedes EQE · B-ME 4501',
  'Audi Q8 e-tron · B-AU 8235',
  'Hyundai Ioniq 5 · B-HY 7108',
  'Kia EV6 · B-KV 6192',
  'Porsche Taycan · B-PT 9904',
  'BMW iX · B-IX 4509',
  'Tesla Model Y · B-TY 1127',
  'Volkswagen ID. Buzz · B-VW 5673',
  'Nissan Leaf · B-NL 2281',
  'Renault Megane E-Tech · B-RM 7840',
  'Skoda Enyaq · B-SE 3325',
  'Volvo EX30 · B-VE 9436',
  'Ford Mustang Mach-E · B-FM 2508',
  'BYD Seal · B-BY 5531'
]

export default function App() {
  const [stations, setStations] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const pageRef = useRef(null)
  const [search, setSearch] = useState('')
const [filter, setFilter] = useState('All')
const [currentTime, setCurrentTime] = useState(new Date())
  useEffect(() => {
  loadData()
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show')
      }
    })
  },
  {
    threshold: 0.15,
  }
)

document.querySelectorAll('.reveal').forEach((el) => {
  observer.observe(el)
})

return () => observer.disconnect()
  const timer = setInterval(() => {
    setCurrentTime(new Date())
  }, 1000)

  return () => clearInterval(timer)
}, [])

  async function loadData() {
    try {
      const [stationResponse, sessionResponse] = await Promise.all([
        fetch('/api/stations'),
        fetch('/api/sessions'),
      ])

      setStations(await stationResponse.json())
      setSessions(await sessionResponse.json())
    } catch {
      setMessage(
        'The website cannot reach the backend. Start npm run server first.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function startSession(vehicle, stationId) {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicle,
        stationId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setMessage(data.error || 'Could not start the session.')
      return
    }

    setMessage(
      `Session started for ${data.vehicle}. It is saved in server/data.json.`
    )

    setShowForm(false)
    loadData()
  }

  async function endSession(sessionId) {
    const response = await fetch('/api/sessions/end', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setMessage(data.error || 'Could not end the session.')
      return
    }

    setMessage('Charging session completed successfully.')
    loadData()
  }

  const availablePorts = stations.reduce(
    (total, station) => total + station.available,
    0
  )

  const chargingPorts = stations.reduce(
    (total, station) => total + station.charging,
    0
  )

  const deliveredEnergy = sessions.reduce(
    (total, session) => total + session.energy,
    0
  ) 
  const filteredSessions = sessions.filter((session) => {
  const text = search.toLowerCase()

  const matchesSearch =
    session.vehicle.toLowerCase().includes(text) ||
    session.station.toLowerCase().includes(text) ||
    session.plate.toLowerCase().includes(text)

  const matchesFilter =
    filter === 'All' || session.status === filter

  return matchesSearch && matchesFilter
})
    return (
    <div className="page">
      <header>

  <div>
    <p className="small-title">EV CHARGING OPERATIONS</p>

    <h1>ChargeFlow</h1>

    <p className="subtitle">
      A simple website for managing charging stations and sessions.
    </p>
  </div>

  <div className="header-actions">

    <div className="clock-box">
      🕒 {currentTime.toLocaleTimeString()}
    </div>

    <button
      className="primary-button"
      onClick={() => setShowForm(true)}
    >
      + Start charging session
    </button>

  </div>

</header>

      {message && (
        <div className="message">
          {message}
          <button onClick={() => setMessage('')}>×</button>
        </div>
      )}

      <section className="summary reveal">
        <InfoCard
          title="Charging now"
          value={chargingPorts}
          note="Ports currently in use"
        />

        <InfoCard
          title="Available ports"
          value={availablePorts}
          note="Ready for a vehicle"
        />

        <InfoCard
          title="Total energy"
          value={`${deliveredEnergy.toFixed(1)} kWh`}
          note="From recorded sessions"
        />

        <InfoCard
          title="Stations"
          value={stations.length}
          note="In the Berlin demo network"
        />
      </section>

      <section className="stations-section reveal">
        <div className="section-title">
          <div>
            <h2>Charging stations</h2>
            <p>Current port availability</p>
          </div>

          <span className="api-label">● Backend API</span>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <div className="station-grid">
            {stations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        )}
      </section>

      <section className="sessions-section reveal">
  <div className="section-title">

    <div>
      <h2>Charging sessions</h2>
      <p>Latest activity in the network</p>
    </div>

    <div className="session-toolbar">
      <input
        className="search-box"
        type="text"
        placeholder="Search vehicle, station or plate..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="filter-select"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option>All</option>
        <option>Charging</option>
        <option>Complete</option>
      </select>
    </div>

  </div>

  <div className="table-box">
    <table>
      <thead>
        <tr>
          <th>Vehicle</th>
          <th>Station</th>
          <th>Started</th>
          <th>Energy</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {filteredSessions.map((session) => (
          <tr key={session.id}>
            <td>
              <b>{session.vehicle}</b>
              <small>{session.plate}</small>
            </td>

            <td>{session.station}</td>

            <td>{session.startedAt}</td>

            <td>{session.energy.toFixed(1)} kWh</td>

            <td>
              <span className={`status ${session.status.toLowerCase()}`}>
                {session.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>

      {showForm && (
        <SessionForm
          stations={stations}
          onClose={() => setShowForm(false)}
          onSubmit={startSession}
        />
      )}
    </div>
  )
}

function InfoCard({ title, value, note }) {
  return (
    <article className="info-card">
      <p>{title}</p>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  )
}

function StationCard({ station }) {
  return (
    <article className="station-card">
      <div className="station-name">
        <span>⚡</span>

        <div>
          <h3>{station.name}</h3>
          <p>{station.address}</p>
        </div>
      </div>

      <div className="port-list">
        <p>
          <b>{station.available}</b> available
        </p>

        <p>
          <b>{station.charging}</b> charging
        </p>

        <p className={station.offline ? 'offline' : ''}>
          <b>{station.offline}</b> offline
        </p>
      </div>

      <div className="station-status">
        {station.status === 'Attention'
          ? '⚠ Needs attention'
          : '● Operating normally'}
      </div>
    </article>
  )
}

function SessionForm({ stations, onClose, onSubmit }) {
  const [vehicle, setVehicle] = useState(vehicles[0])

  const [stationId, setStationId] = useState(
    stations.find((station) => station.available > 0)?.id || ''
  )

  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    await onSubmit(vehicle, stationId)
    setSaving(false)
  }

  return (
    <div className="modal-background">
      <form className="form" onSubmit={submit}>
        <button
          type="button"
          className="close"
          onClick={onClose}
        >
          ×
        </button>

        <h2>Start charging</h2>

        <p>
          This will create a session and reduce the selected station's
          available ports by one.
        </p>

        <label>
          Vehicle

          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          >
            {vehicles.map((vehicle) => (
              <option key={vehicle}>{vehicle}</option>
            ))}
          </select>
        </label>

        <label>
          Station

          <select
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
          >
            {stations
              .filter((station) => station.available > 0)
              .map((station) => (
                <option
                  key={station.id}
                  value={station.id}
                >
                  {station.name} ({station.available} ports free)
                </option>
              ))}
          </select>
        </label>

        <button
          className="primary-button form-button"
          disabled={!stationId || saving}
        >
          {saving ? 'Saving...' : 'Start session'}
        </button>
      </form>
    </div>
  )
}