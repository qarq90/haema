const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");

function copyDirectory(source, destination) {
    if (!fs.existsSync(source)) return;
    fs.cpSync(source, destination, { recursive: true, force: true });
}

copyDirectory(path.join(root, "public"), path.join(standalone, "public"));
copyDirectory(
    path.join(root, ".next", "static"),
    path.join(standalone, ".next", "static"),
);

console.log("Prepared Next.js standalone output for Electron.");
