const sharp = require("sharp");

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect width="24" height="24" fill="#171717" rx="4"/>
  <g transform="translate(3 2.5)">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
    <path d="M14 2v6h6"/>
    <circle cx="11.5" cy="14.5" r="2.5"/>
    <path d="M13.3 16.3 15 18"/>
  </g>
</svg>`;

const svgBuffer = Buffer.from(svgContent);

async function main() {
  await sharp(svgBuffer).resize(192, 192).png().toFile("public/icon-192.png");
  console.log("Generated public/icon-192.png");

  await sharp(svgBuffer).resize(512, 512).png().toFile("public/icon-512.png");
  console.log("Generated public/icon-512.png");
}

main();
