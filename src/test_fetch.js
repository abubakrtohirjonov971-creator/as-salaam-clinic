async function checkPhotos() {
  const ids = [
    '1581594693702-fbdc51b2763b',
    '1559757175-5700dde675bc',
    '1516549655169-df83a0774514',
    '1576091160550-2173ff9e5ee5',
    '1579684385127-1ef15d508118',
    '1530497610245-94d3c16cda28',
    '1527613426441-4cb5cefa59f5',
    '1583454155184-870a1f63aebc',
    '1581595220892-b0739db3ba8c',
    '1584515933487-779824d29309'
  ];
  for (let id of ids) {
    const res = await fetch(`https://images.unsplash.com/photo-${id}?w=10`);
    console.log(`photo-${id}: ${res.status}`);
  }
}
checkPhotos();
