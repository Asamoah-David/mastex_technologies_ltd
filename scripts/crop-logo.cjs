const sharp = require("./_sharp.cjs");
const path = require("path");
const dir = path.resolve(__dirname, "..");
const src = path.join(dir, "public", "logo.jpeg");

(async () => {
  const meta = await sharp(src).metadata();
  console.log("source", meta.width, "x", meta.height);
  // Tight crop around the "M" mark (full lockup image is 1536x1024).
  // Tight box around just the "M" (excludes the wordmark below it).
  await sharp(src)
    .extract({ left: 558, top: 196, width: 430, height: 378 })
    .resize(200, 200, { fit: "cover" })
    .png()
    .toFile(path.join(dir, "public", "logo-mark.png"));
  console.log("wrote public/logo-mark.png");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
