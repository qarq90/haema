const { app, BrowserWindow, dialog } = require("electron");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const port = 3210;
let serverProcess;

function getAppRoot() {
    return app.isPackaged
        ? path.join(process.resourcesPath, "app")
        : path.join(__dirname, "..");
}

function loadLocalEnv(appRoot) {
    const envPath = path.join(appRoot, ".env.local");
    if (!fs.existsSync(envPath)) return {};
    return Object.fromEntries(
        fs.readFileSync(envPath, "utf8")
            .split(/\r?\n/)
            .filter((line) => line && !line.trimStart().startsWith("#"))
            .map((line) => {
                const separator = line.indexOf("=");
                if (separator < 0) return [line, ""];
                return [
                    line.slice(0, separator).trim(),
                    line.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, "$2"),
                ];
            }),
    );
}

function startNextServer() {
    const appRoot = getAppRoot();
    const serverPath = path.join(appRoot, ".next", "standalone", "server.js");
    if (!fs.existsSync(serverPath)) {
        throw new Error(`Next.js server was not found at ${serverPath}. Build the app first.`);
    }

    serverProcess = spawn(process.execPath, [serverPath], {
        cwd: path.dirname(serverPath),
        env: {
            ...process.env,
            ...loadLocalEnv(appRoot),
            ELECTRON_RUN_AS_NODE: "1",
            PORT: String(port),
            HOSTNAME: "127.0.0.1",
        },
        stdio: "ignore",
        windowsHide: true,
    });
}

async function waitForServer() {
    for (let attempt = 0; attempt < 60; attempt += 1) {
        try {
            await fetch(`http://127.0.0.1:${port}`);
            return;
        } catch {
            await new Promise((resolve) => setTimeout(resolve, 250));
        }
    }
    throw new Error("The local Next.js server did not start in time.");
}

async function createWindow() {
    startNextServer();
    await waitForServer();

    const window = new BrowserWindow({
        width: 1440,
        height: 960,
        minWidth: 1024,
        minHeight: 700,
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    window.once("ready-to-show", () => window.show());
    await window.loadURL(`http://127.0.0.1:${port}`);
}

app.whenReady().then(() => createWindow()).catch((error) => {
    dialog.showErrorBox("HAEMA could not start", error.message);
    app.quit();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
    if (serverProcess && !serverProcess.killed) serverProcess.kill();
});
