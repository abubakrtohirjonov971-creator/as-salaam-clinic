import { Jimp } from 'jimp';

async function removeBackground() {
  const image = await Jimp.read('src/assets/logo.jpg');
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  const isWhite = (x, y) => {
    const idx = (y * width + x) * 4;
    const r = image.bitmap.data[idx];
    const g = image.bitmap.data[idx + 1];
    const b = image.bitmap.data[idx + 2];
    return r > 200 && g > 200 && b > 200; // Allow more tolerance for JPEG artifacts
  };
  
  const setTransparent = (x, y) => {
    const idx = (y * width + x) * 4;
    image.bitmap.data[idx + 3] = 0;
  };

  // We will do a robust flood fill using an iterative approach that prevents queue explosion.
  const visited = new Uint8Array(width * height);
  const queue = [];
  
  // Add all border pixels that are white to the queue
  for (let x = 0; x < width; x++) {
    if (isWhite(x, 0)) queue.push({x, y: 0});
    if (isWhite(x, height - 1)) queue.push({x, y: height - 1});
  }
  for (let y = 0; y < height; y++) {
    if (isWhite(0, y)) queue.push({x: 0, y});
    if (isWhite(width - 1, y)) queue.push({x: width - 1, y});
  }
  
  // Mark initial queue as visited
  for (const p of queue) {
    visited[p.y * width + p.x] = 1;
  }
  
  let head = 0;
  while(head < queue.length) {
    const {x, y} = queue[head++];
    
    setTransparent(x, y);
    
    const neighbors = [
      {x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1}
    ];
    
    for (const n of neighbors) {
      if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
        const idx = n.y * width + n.x;
        if (!visited[idx] && isWhite(n.x, n.y)) {
          visited[idx] = 1;
          queue.push(n);
        }
      }
    }
  }
  
  // Also crop the transparent borders so the logo isn't padded by huge empty space
  // image.autocrop(); 
  
  await image.write('src/assets/logo_transparent.png');
  console.log('Successfully saved proper transparent logo! Pixels processed:', queue.length);
}

removeBackground().catch(console.error);
