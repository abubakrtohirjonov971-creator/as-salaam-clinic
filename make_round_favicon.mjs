import fs from 'fs';
import path from 'path';

const imagePath = path.resolve('public', 'favicon.png');
const svgPath = path.resolve('public', 'favicon.svg');

// Read the image and convert to base64
const imageBuffer = fs.readFileSync(imagePath);
const base64Image = imageBuffer.toString('base64');
const mimeType = 'image/png'; // Or jpeg

// Create an SVG with a circular clipping path
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
  <defs>
    <clipPath id="circleClip">
      <circle cx="250" cy="250" r="250" />
    </clipPath>
  </defs>
  <!-- Optional white background circle just in case -->
  <circle cx="250" cy="250" r="250" fill="white" />
  <image width="500" height="500" href="data:${mimeType};base64,${base64Image}" clip-path="url(#circleClip)" preserveAspectRatio="xMidYMid slice" />
</svg>`;

fs.writeFileSync(svgPath, svgContent);
console.log('Successfully created round favicon.svg!');
