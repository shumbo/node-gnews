# node-gnews

[![Build Status](https://travis-ci.org/shumbo/node-gnews.svg?branch=master)](https://travis-ci.org/shumbo/node-gnews)

> A simple node module that loads articles from Google News

## Overview

This is an unofficial node module that allows you to easily load articles from Google News via its RSS feed and convert them into JavaScript Object.

Strongly inspired by [google-news-rss](https://github.com/brh55/google-news-rss), but tweaked a bit.

## Install

```sh
npm install node-gnews --save
```

or in case you use yarn:

```sh
yarn add node-gnews
```

## Usage

Clone this repo and open `./samples` to run.

### Get headlines

Load headlines and return it as an array.

```typescript
const Gnews = require('node-gnews').Gnews;
const instance = new Gnews();

// Headlines for topics
instance.headlines().then(articles => console.log(articles)); // -> display headlines in U.S.
```

### Get headlines in topic

Load headlines in a certain topic. Visit [Google News](https://news.google.com) and you will see `SECTIONS` on the left sidebar as below.

<img src="https://i.imgur.com/GtLVy4Z.png" width=200>

If you click one, the address should be something like `https://news.google.com/news/headlines/section/topic/WORLD?ned=us&hl=en&gl=US`. In this case, `WORLD` would be a topic for the content and you can pass it as a first argument of `headlines()`.

```javascript
instance.headlines('WORLD').then(articles => console.log(articles)); // -> display headlines of 'World' topic.
```

Note that topics may not be available on every language. Please make sure that the topic is available on a language you are going to use on a browser.

### Search

Search for keywords

```javascript
instance.search('Nintendo').then(articles => console.log(articles)); // -> Search result
```

### Change Region (and more)

You may pass optional parameters to change region. As a default, the library will load news in the U.S.

For example, if you change the region to Japan on news.google.com, its URL will be

> https://news.google.com/news/?ned=jp&hl=ja&gl=JP

Three parameters: 'ned', 'hl' and 'gl' decide which region to load articles from so that you can use it to change the locale.

```javascript
const Gnews = require('node-gnews').Gnews;
const instance = new Gnews({
  ned: 'jp',
  hl: 'ja',
  gl: 'JP'
}); // Set Japanese as a default

instance
  .headlines()
  .then(articles => console.log(articles)); // -> Japanese Headlines

instance.search('Doctor Who',{
  ned: 'uk',
  hl: 'en-GB',
  gl: 'GB'
}).then(articles => console.log(articles)); // -> Search "Doctor Who" in U.K.
```

All the values in the second argument will be used as parameters to load RSS so you may use it for different purposes.

## Article Properties

|Property|Description|Example|
|---|---|---|
|title|title of the article|The Last Jedi spoiler talk: Mark Hamill discusses the secrets of Luke Skywalker's return|
|link|link to the article|http://ew.com/movies/2017/12/16/the-last-jedi-spoilers-rian-johnson-mark-hamill-luke-skywalker-revelations/|
|category|category of the article|More Top Stories|
|pubDate|Date the article was published|Sat, 16 Dec 2017 16:00:29 GMT|
|description|HTML to guide related articles|[Click to see example](https://gist.github.com/shumbo/4fdc8d41866ccfbb084f444c3e44e11e)|
|publisher|Publisher of the article|EW.com|
|fullCoverage|Link to the Google News Related Stories|https://news.google.com/story/dOHKnaQodeaDspMmZOqoGu4YGQ47M?hl=en&ned=us (expired)|
|related|Array of related stories. Each has title, link and publisher|[Click to see example](https://gist.github.com/shumbo/c8b6f6c7db0ab50995bfc24c1c4146a4)|
|thumbnailUrl|Thumbnail image url. **Omitted when not available.**|https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSzlMagnYwijdaLtdc4MWJopShsC9vRGDh-_LKP9GlJ_ofu6J8OyUFdlebTu4e1JT6mb0_YY7Lw59M|
