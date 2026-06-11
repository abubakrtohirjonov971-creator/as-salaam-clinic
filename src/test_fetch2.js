async function checkPhotos() {
  const ids = [
    '1519494026892-80bbd2d6fd0d', // original Fizio
    '1579684385127-1ef15d508118', // original Diag
    '1581056771107-11a4e8c1ea90', // therapy?
    '1516549655169-df83a0774514', // doctor spine
    '1576091160550-2173ff9e5ee5' // broken rehab
  ];
  for (let id of ids) {
    const res = await fetch(`https://images.unsplash.com/photo-${id}?w=10`);
    console.log(`photo-${id}: ${res.status}`);
  }
}
checkPhotos();
