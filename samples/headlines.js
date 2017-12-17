const Gnews = require('../dist').Gnews;

const instance = new Gnews();

// pass null on first argument to load headlines across topics
instance.headlines().then(articles => console.log(articles));
