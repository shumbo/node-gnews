const Gnews = require('../dist').Gnews;

const instance = new Gnews();

// Search Google News for 'Nintendo'
instance.search('Nintendo').then(articles => console.log(articles));
