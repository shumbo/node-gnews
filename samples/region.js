const Gnews = require('../dist').Gnews;

const instance = new Gnews();

// Pass 'ned', 'hl' and 'gl' on second argument to change regions
instance.headlines(null,{
  ned:'jp',
  hl:'ja',
  gl:'JP'
}).then(articles => console.log(articles)); // headlines in Japan
