/**
 * After react-scripts build: inject <link rel="icon"> into build/index.html using the
 * hashed URL from asset-manifest.json. Browsers read tab icons before JS runs, so this
 * must be in HTML. Also rewrites build/manifest.json icons to the same URL (fixes PWA /
 * Chrome picking old logo192 React defaults).
 */
const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");
const amPath = path.join(buildDir, "asset-manifest.json");

if (!fs.existsSync(amPath)) {
  console.warn("patch-favicon: build/asset-manifest.json missing, skip.");
  process.exit(0);
}

const am = JSON.parse(fs.readFileSync(amPath, "utf8"));
const files = am.files || {};
const favKey = Object.keys(files).find((k) => k.includes("site-favicon"));
if (!favKey) {
  console.warn("patch-favicon: site-favicon.png not in bundle (import it from src), skip.");
  process.exit(0);
}

const absPath = files[favKey];
const rel = absPath.startsWith("/") ? absPath.slice(1) : absPath;

const inject = `<link rel="icon" type="image/png" href="${absPath}"/><link rel="shortcut icon" type="image/png" href="${absPath}"/><link rel="apple-touch-icon" href="${absPath}"/>`;

const indexPath = path.join(buildDir, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
if (html.includes(absPath)) {
  console.log("patch-favicon: index.html already contains favicon URL, skip html.");
} else {
  let replaced = html.replace("<head>", `<head>${inject}`);
  if (replaced === html) {
    console.error("patch-favicon: could not find <head> in build/index.html");
    process.exit(1);
  }
  /* Drop dev fallback /favicon.png so production does not hit broken /favicon.* on the host */
  replaced = replaced.replace(
    /<link rel="icon" type="image\/png" href="\/favicon\.png"\s*\/?>/gi,
    ""
  );
  fs.writeFileSync(indexPath, replaced);
}

const wmPath = path.join(buildDir, "manifest.json");
if (fs.existsSync(wmPath)) {
  const wm = JSON.parse(fs.readFileSync(wmPath, "utf8"));
  wm.icons = [
    {
      src: rel,
      type: "image/png",
      sizes: "192x192",
      purpose: "any",
    },
    {
      src: rel,
      type: "image/png",
      sizes: "512x512",
      purpose: "any",
    },
  ];
  fs.writeFileSync(wmPath, `${JSON.stringify(wm, null, 2)}\n`);
}

console.log("patch-favicon: tab + manifest icons ->", absPath);
