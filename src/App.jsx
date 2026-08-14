import { useEffect, useState } from 'react'

const vehicles = [
  'BMW i4 · B-EL 4821',
  'Tesla Model 3 · B-TM 2901',
  'Volkswagen ID.4 · B-RV 1172',
]

export default function App() {
  const [stations, setStations] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadData()
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
      setMessage('The website cannot reach the backend. Start npm run server first.')
    } finally {
      setLoading(false)
    }
  }

  async function startSession(vehicle, stationId) {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicle, stationId }),
    })
    const data = await response.json()

    if (!response.ok) {
      setMessage(data.error || 'Could not start the session.')
      return
    }

    setMessage(`Session started for ${data.vehicle}. It is saved in server/data.json.`)
    setShowForm(false)
    loadData()
  }

  const availablePorts = stations.reduce((total, station) => total + station.available, 0)
  const chargingPorts = stations.reduce((total, station) => total + station.charging, 0)
  const deliveredEnergy = sessions.reduce((total, session) => total + session.energy, 0)

  return (
    <div className="page">
      <header>
        <div>
          <p className="small-title">EV CHARGING OPERATIONS</p>
          <h1>ChargeFlow</h1>
          <p className="subtitle">A simple website for managing charging stations and sessions.</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(true)}>+ Start charging session</button>
      </header>

      {message && <div className="message">{message}<button onClick={() => setMessage('')}>×</button></div>}

      <section className="summary">
        <InfoCard title="Charging now" value={chargingPorts} note="Ports currently in use" />
        <InfoCard title="Available ports" value={availablePorts} note="Ready for a vehicle" />
        <InfoCard title="Total energy" value={`${deliveredEnergy.toFixed(1)} kWh`} note="From recorded sessions" />
        <InfoCard title="Stations" value={stations.length} note="In the Berlin demo network" />
      </section>

      <section>
        <div className="section-title"><div><h2>Charging stations</h2><p>Current port availability</p></div><span className="api-label">● Backend API</span></div>
        {loading ? <p>Loading data…</p> : <div className="station-grid">{stations.map((station) => <StationCard station={station} key={station.id} />)}</div>}
      </section>

      <section className="sessions-section">
        <div className="section-title"><div><h2>Charging sessions</h2><p>Latest activity in the network</p></div></div>
        <div className="table-box"><table><thead><tr><th>Vehicle</th><th>Station</th><th>Started</th><th>Energy</th><th>Status</th></tr></thead><tbody>{sessions.map((session) => <tr key={session.id}><td><b>{session.vehicle}</b><small>{session.plate}</small></td><td>{session.station}</td><td>{session.startedAt}</td><td>{session.energy.toFixed(1)} kWh</td><td><span className={`status ${session.status.toLowerCase()}`}>{session.status}</span></td></tr>)}</tbody></table></div>
      </section>

      {showForm && <SessionForm stations={stations} onClose={() => setShowForm(false)} onSubmit={startSession} />}
    </div>
  )
}

function InfoCard({ title, value, note }) {
  return <article className="info-card"><p>{title}</p><strong>{value}</strong><small>{note}</small></article>
}

function StationCard({ station }) {
  return <article className="station-card">
    <div className="station-name"><span>⚡</span><div><h3>{station.name}</h3><p>{station.address}</p></div></div>
    <div className="port-list"><p><b>{station.available}</b> available</p><p><b>{station.charging}</b> charging</p><p className={station.offline ? 'offline' : ''}><b>{station.offline}</b> offline</p></div>
    <div className="station-status">{station.status === 'Attention' ? '⚠ Needs attention' : '● Operating normally'}</div>
  </article>
}

function SessionForm({ stations, onClose, onSubmit }) {
  const [vehicle, setVehicle] = useState(vehicles[0])
  const [stationId, setStationId] = useState(stations.find((station) => station.available > 0)?.id || '')
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    await onSubmit(vehicle, stationId)
    setSaving(false)
  }

  return <div className="modal-background"><form className="form" onSubmit={submit}><button type="button" className="close" onClick={onClose}>×</button><h2>Start charging</h2><p>This will create a session and reduce the selected station's available ports by one.</p><label>Vehicle<select value={vehicle} onChange={(event) => setVehicle(event.target.value)}>{vehicles.map((item) => <option key={item}>{item}</option>)}</select></label><label>Station<select value={stationId} onChange={(event) => setStationId(event.target.value)}>{stations.filter((station) => station.available > 0).map((station) => <option value={station.id} key={station.id}>{station.name} ({station.available} ports free)</option>)}</select></label><button className="primary-button form-button" disabled={!stationId || saving}>{saving ? 'Saving…' : 'Start session'}</button></form></div>
}
