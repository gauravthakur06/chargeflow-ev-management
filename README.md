# ChargeFlow

ChargeFlow is a small web application for an EV charging company. It lets an operator view charging stations, see which ports are free, and start a charging session for a vehicle.

## What it uses

- React (frontend user interface)
- JavaScript and CSS
- Node.js (backend server)
- JSON file storage for the current demo

## Run the project

Open two terminals in the project folder.

**Terminal 1 — backend**

```bash
npm run server
```

**Terminal 2 — frontend**

```bash
npm run dev
```

Open the frontend link shown in the second terminal, usually `http://localhost:5173`.

## Current features

- View three demo charging stations in Berlin
- See free, charging, and offline ports
- View recorded charging sessions
- Start a session using the form
- Save new sessions in `server/data.json`

## Next features to build

1. End a charging session and release the port.
2. Add and edit vehicles.
3. Replace `data.json` with SQLite database storage.
4. Add a station details page and fault report feature.

This is a student portfolio project using fictional data.
