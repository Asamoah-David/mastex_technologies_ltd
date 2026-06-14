const sharp = require("./_sharp.cjs");
const path = require("path");
const dir = path.resolve(__dirname, "..");
const src = path.join(dir, "public", "logo.jpeg");

// The "M" mark cropped from the full lockup, on its native dark background.
const mark = sharp(src).extract({ left: 558, top: 196, width: 430, height: 378 });

async function make(size, name) {
  await mark
    .clone()
    .resize(size, size, { fit: "cover" })
    .png()
    .toFile(path.join(dir, "public", name));
  console.log("wrote public/" + name);
}

(async () => {
  await make(192, "icon-192.png");
  await make(512, "icon-512.png");
  await make(180, "apple-icon.png");
  await make(32, "favicon-32.png");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
