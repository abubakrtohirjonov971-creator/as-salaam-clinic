const https = require('https');

const queries = ['orthopedic', 'neurosurgeon', 'spine', 'physiotherapy', 'rehabilitation', 'mri'];
const apikey = 'Client-ID ' + 'YOUR_KEY_HERE'; // don't have api key

// Let's use standard keyword search which sometimes redirects:
// https://source.unsplash.com/1000x800/?orthopedic,bones
// The Source API is deprecated and redirects to Unsplash.com/photos/random
