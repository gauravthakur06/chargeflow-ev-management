# ChargeFlow — EV Charging Operations Dashboard

ChargeFlow is a student portfolio project that demonstrates how an operator can monitor electric vehicle charging stations and manage charging sessions through a web dashboard.

The application uses fictional demonstration data for charging stations in Berlin.

## Application Preview

### Dashboard

 <img width="1791" height="486" alt="Screenshot 2026-10-09 231821" src="https://github.com/user-attachments/assets/35e27ab4-3223-44a8-9358-35abfcd35e08" />


### Charging Stations

<img width="1778" height="912" alt="Screenshot 2026-10-09 231836" src="https://github.com/user-attachments/assets/378d3f80-b260-4612-be9e-9003560e5219" />


### Charging Sessions

<img width="1771" height="913" alt="Screenshot 2026-10-09 231849" src="https://github.com/user-attachments/assets/073292fa-8c56-478f-85f5-d107a005bf06" />


## Features

* View three demo charging stations in Berlin.
* Monitor available, charging, and offline ports.
* View recorded charging sessions.
* Start a charging session for a selected vehicle.
* Store demonstration data in a local JSON file.


## Technology Stack

* **Frontend:** React, JavaScript, CSS
* **Build tool:** Vite
* **Backend:** Node.js
* **Data storage:** JSON file

## Run Locally

### Prerequisites

* Node.js and npm installed.
* Git installed if cloning the repository.

### Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/gauravthakur06/chargeflow-ev-management.git
cd chargeflow-ev-management
```

Install the dependencies:

```bash
npm install
```

### Start the application

Open two terminals in the project directory.

**Terminal 1 — Backend**

```bash
npm run server
```

**Terminal 2 — Frontend**

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Data Storage

The current demonstration version stores station and session data in `server/data.json`. Changes are stored locally in that file.

## Planned Improvements

* Add and edit vehicles.
* Replace JSON file storage with SQLite.
* Add a station details page.
* Add a fault reporting feature.

## Project Scope

ChargeFlow is a student portfolio project using fictional data. It is intended for demonstration and learning purposes, not for managing real charging infrastructure.
