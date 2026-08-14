# Start here

This project is a website. It has two parts:

- `src/` is the frontend. This is what the user sees in the browser.
- `server/` is the backend. This saves and returns the station/session data.

## How to run it

Open two terminals in VS Code.

In both terminals, first go to the project folder:

```powershell
cd "C:\Users\gaura\Documents\Codex\2026-08-13\project-2-automotive-iot-software-since-2"
```

In terminal one:

```powershell
npm.cmd run server
```

In terminal two:

```powershell
npm.cmd run dev
```

Open `http://localhost:5173` in a browser.

## Files you can edit safely

- `src/App.jsx` — page text, buttons, and frontend behaviour
- `src/styles.css` — colours, spacing, and page design
- `server/data.json` — demo stations and sessions
- `server/server.mjs` — backend rules

## Simple test

1. Open the website.
2. Click **Start charging session**.
3. Choose a car and station.
4. Click **Start session**.
5. Refresh the browser. The new session should still appear.

The data was saved in `server/data.json`.

## Important

Do not delete `package.json`. It tells npm how to run the project.
Do not upload the `node_modules` folder to GitHub. The `.gitignore` file already prevents that.
