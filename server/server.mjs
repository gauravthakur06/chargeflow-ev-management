// This is the backend for ChargeFlow.
// It runs on http://localhost:3001 and stores data in data.json.

import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const folder = path.dirname(fileURLToPath(import.meta.url))
const dataFile = path.join(folder, 'data.json')

async function getDatabase() {
  const text = await readFile(dataFile, 'utf8')
  return JSON.parse(text)
}

async function saveDatabase(data) {
  await writeFile(dataFile, JSON.stringify(data, null, 2))
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  })
  response.end(JSON.stringify(data))
}

async function getRequestBody(request) {
  let text = ''
  for await (const part of request) text += part
  return JSON.parse(text)
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost:3001')

  try {
    // Read all stations.
    if (request.method === 'GET' && url.pathname === '/api/stations') {
      const database = await getDatabase()
      return sendJson(response, 200, database.stations)
    }

    // Read all sessions.
    if (request.method === 'GET' && url.pathname === '/api/sessions') {
      const database = await getDatabase()
      return sendJson(response, 200, database.sessions)
    }

    // Create a new session and update the free-port count.
    if (request.method === 'POST' && url.pathname === '/api/sessions') {
      const body = await getRequestBody(request)
      const database = await getDatabase()
      const station = database.stations.find((item) => item.id === body.stationId)

      if (!body.vehicle || !station) {
        return sendJson(response, 400, { error: 'Please choose a vehicle and a station.' })
      }

      if (station.available === 0) {
        return sendJson(response, 400, { error: 'There are no free ports at this station.' })
      }

      const [vehicle, plate] = body.vehicle.split(' · ')
      const session = {
        id: `session-${Date.now()}`,
        vehicle,
        plate,
        station: `${station.name} · Port ${String(station.charging + 1).padStart(2, '0')}`,
        startedAt: 'Just now',
        energy: 0,
        duration: '0m',
        status: 'Charging',
      }

      station.available -= 1
      station.charging += 1
      database.sessions.unshift(session)
      await saveDatabase(database)

      return sendJson(response, 201, session)
    }

    return sendJson(response, 404, { error: 'Page not found.' })
  } catch (error) {
    console.error(error)
    return sendJson(response, 500, { error: 'The server could not process this request.' })
  }
})

server.listen(3001, () => {
  console.log('ChargeFlow backend: http://localhost:3001')
})
