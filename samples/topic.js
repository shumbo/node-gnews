const Gnews = require('../dist').Gnews;

const instance = new Gnews();

// Get headlines for topic 'POLITICS'
instance.headlines('POLITICS').then(articles => console.log(articles));
