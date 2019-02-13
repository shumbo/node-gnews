import test from 'ava';
import nock from 'nock';
import { AllHtmlEntities } from 'html-entities';
const entities = new AllHtmlEntities();

import topic from './mock/topic';
import search from './mock/search';

import { Gnews } from './dist';

const instance = new Gnews();

const link = 'https://news.google.com';

test('Load headlines and returns formatted articles', async t => {
  t.plan(2);
  const expectedArticle = {
    title:
      'Australian police accuse man of acting as North Korean economic agent',
    link:
      'http://www.cnn.com/2017/12/16/asia/australia-nkorea-arrest/index.html',
    category: 'World',
    pubDate: 'Sun, 17 Dec 2017 02:16:24 GMT',
    description:
      '<table border="0" cellpadding="2" cellspacing="3"><tr><td><img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSStFGoURvbhN2B3uOAMfecR8xA8VPQZeqYVHQU1fet9AuOyvWOAv4qMamS5o94sC7mtt87J6Y6QOw" border="1"></td><td><ol style="list-style: none; margin: 0; padding: 0;"><strong><li><a href="http://www.cnn.com/2017/12/16/asia/australia-nkorea-arrest/index.html" target="_blank">Australian police accuse man of acting as North Korean economic agent</a>  <font color="#6f6f6f">CNN</font></li></strong><li><a href="https://www.nytimes.com/2017/12/17/world/australia/australia-north-korea-missile-arrest.html" target="_blank">Australian Tried to Sell Missile Parts for North Korea, Police Say</a>  <font color="#6f6f6f">New York Times</font></li><li><a href="http://www.bbc.com/news/world-australia-42382399" target="_blank">Sydney man charged with being \'economic agent\' for North Korea</a>  <font color="#6f6f6f">BBC News</font></li><li><a href="https://www.dailytelegraph.com.au/news/nsw/afp-charge-sydney-man-over-north-korea-brokering/news-story/a9f7f67855fbdbc28bb0ab01aca7a710" target="_blank">AFP charge Sydney man over North Korea weapons brokering</a>  <font color="#6f6f6f">Daily Telegraph</font></li><a href="https://news.google.com/story/dlsXxqrSy2rUJaMH0ymTb3ve8h_JM?hl=en&ned=us" target="_blank">Full coverage</a></ol></td></tr></table>',
    publisher: 'CNN',
    fullCoverage:
      'https://news.google.com/story/dlsXxqrSy2rUJaMH0ymTb3ve8h_JM?hl=en&ned=us',
    related: [
      {
        title:
          'Australian Tried to Sell Missile Parts for North Korea, Police Say',
        link:
          'https://www.nytimes.com/2017/12/17/world/australia/australia-north-korea-missile-arrest.html',
        publisher: 'New York Times'
      },
      {
        title: "Sydney man charged with being 'economic agent' for North Korea",
        link:
          'http://www.bbc.com/news/world-australia-42382399',
        publisher: 'BBC News'
      },
      {
        title: 'AFP charge Sydney man over North Korea weapons brokering',
        link:
          'https://www.dailytelegraph.com.au/news/nsw/afp-charge-sydney-man-over-north-korea-brokering/news-story/a9f7f67855fbdbc28bb0ab01aca7a710',
        publisher: 'Daily Telegraph'
      }
    ]
  };

  const scope = nock(link)
    .get('/news/rss/headlines/section/topic/WORLD')
    .query({
      gl: 'US',
      ned: 'us',
      hl: 'en'
    })
    .reply(200, topic);

  const articles = await instance.headlines('WORLD');
  t.deepEqual(articles[0], expectedArticle);
  t.true(scope.isDone());
});

test('load search results', async t => {
  t.plan(2);
  const expectedArticle = {
    title:
      'The Nintendo Switch Offers Unique Opportunities For Players And Developers Alike',
    link:
      'https://www.forbes.com/sites/kevinmurnane/2017/12/16/the-nintendo-switch-offers-unique-opportunities-for-players-and-developers-alike/',
    category: 'nintendo',
    pubDate: 'Sat, 16 Dec 2017 19:30:52 GMT',
    description: entities
      .decode(
        '&lt;table border="0" cellpadding="2" cellspacing="3"&gt;&lt;tr&gt;&lt;td&gt;&lt;img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSWE57yJAuPHskDGwgSGKoUp7QfIbwh5ek8UUwUrGeMLLyXxtHjWJLTHjN_9-A5eDf2AvBS6xHsnQ" border="1"&gt;&lt;/td&gt;&lt;td&gt;&lt;ol style="list-style: none; margin: 0; padding: 0;"&gt;&lt;strong&gt;&lt;li&gt;&lt;a href="https://www.forbes.com/sites/kevinmurnane/2017/12/16/the-nintendo-switch-offers-unique-opportunities-for-players-and-developers-alike/" target="_blank"&gt;The Nintendo Switch Offers Unique Opportunities For Players And Developers Alike&lt;/a&gt;&amp;nbsp;&amp;nbsp;&lt;font color="#6f6f6f"&gt;Forbes&lt;/font&gt;&lt;/li&gt;&lt;/strong&gt;&lt;li&gt;&lt;a href="https://www.pastemagazine.com/articles/2017/12/what-nintendo-can-teach-us-about-exploration-in-op.html" target="_blank"&gt;What Nintendo Can Teach Us About Exploration in Open World Game Design&lt;/a&gt;&amp;nbsp;&amp;nbsp;&lt;font color="#6f6f6f"&gt;Paste Magazine&lt;/font&gt;&lt;/li&gt;&lt;li&gt;&lt;a href="https://cogconnected.com/2017/12/yooka-laylee-finally-nintendo-switch/" target="_blank"&gt;Yooka-Laylee Finally Out On Nintendo Switch&lt;/a&gt;&amp;nbsp;&amp;nbsp;&lt;font color="#6f6f6f"&gt;COGconnected&lt;/font&gt;&lt;/li&gt;&lt;a href="https://news.google.com/story/dFB9tmCh7NpJnbMrO5E2ANrVmC9PM?hl=en&ned=us" target="_blank"&gt;Full coverage&lt;/a&gt;&lt;/ol&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;'
      )
      .replace(/&nbsp;/g, String.fromCharCode(160)), // non-breaking space
    publisher: 'Forbes',
    fullCoverage:
      'https://news.google.com/story/dFB9tmCh7NpJnbMrO5E2ANrVmC9PM?hl=en&ned=us',
    related: [
      {
        title:
          'What Nintendo Can Teach Us About Exploration in Open World Game Design',
        link:
          'https://www.pastemagazine.com/articles/2017/12/what-nintendo-can-teach-us-about-exploration-in-op.html',
        publisher: 'Paste Magazine'
      },
      {
        title: 'Yooka-Laylee Finally Out On Nintendo Switch',
        link:
          'https://cogconnected.com/2017/12/yooka-laylee-finally-nintendo-switch/',
        publisher: 'COGconnected'
      }
    ]
  };

  const scope = nock(link)
    .get('/news/rss/search/section/q/nintendo/nintendo')
    .query({
      gl: 'US',
      ned: 'us',
      hl: 'en'
    })
    .reply(200, search);

  const articles = await instance.search('nintendo');
  t.deepEqual(articles[0], expectedArticle);
  t.true(scope.isDone());
});

test('preconfigured instance', async t => {
  t.plan(1);
  const params = {
    ned: 'jp',
    hl: 'ja',
    gl: 'JP'
  };
  const configuredInstance = new Gnews(params);
  const scope = nock(link)
    .get('/news/rss')
    .query(params)
    .reply(200, topic);
  await configuredInstance.headlines();
  t.true(scope.isDone());
});

test('override configured params', async t => {
  t.plan(1);
  const configuredInstance = new Gnews({
    ned: 'jp',
    hl: 'ja',
    gl: 'JP'
  });
  const overrideParams = {
    ned: 'uk',
    hl: 'en-GB',
    gl: 'GB'
  };
  const scope = nock(link)
    .get('/news/rss/search/section/q/doctor%20who/doctor%20who')
    .query(overrideParams)
    .reply(200, search);
  await configuredInstance.search('doctor who', overrideParams);
  t.true(scope.isDone());
});
