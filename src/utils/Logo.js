const fs = require("fs");
const path = require("path");

const dirPath = path.join(__dirname, "client/public/assets/images/client logo");
const outputPath = path.join(__dirname, "client/src/data/logos.js");

const imageFiles = fs.readdirSync(dirPath).filter(file =>
  /\.(png|jpe?g|webp|svg)$/i.test(file)
);

const logos = imageFiles.map(file => `/assets/images/client logo/${file}`);

const fileContent = `// Auto-generated file. Do not edit manually.
const logos = ${JSON.stringify(logos, null, 2)};
export default logos;
`;

fs.writeFileSync(outputPath, fileContent);
console.log(`✅ Generated logos.js with ${logos.length} images`);
