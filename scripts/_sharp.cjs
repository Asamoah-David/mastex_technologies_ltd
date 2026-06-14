// Resolve sharp from pnpm's nested store (it's Next.js's optional dependency).
const path = require("path");
module.exports = require(
  path.resolve(__dirname, "..", "node_modules/.pnpm/sharp@0.33.5/node_modules/sharp"),
);
