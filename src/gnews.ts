import axios from 'axios';
import * as cheerio from 'cheerio';
import { AllHtmlEntities } from 'html-entities';
import { get } from 'lodash';
import * as xml2js from 'xml2js';

export interface NewsArticle {
  title: string;
  link: string;
  category: string;
  pubDate: string;
  description: string;
  publisher: string;
  fullCoverage: string;
  related: RelatedArticle[];
  thumbnailUrl: string | null;
}
export interface RelatedArticle {
  title: string;
  link: string;
  publisher: string;
}

const parseXml = (xml: string): any => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const flattenArticles = (article: any): any =>
  Object.entries(article).reduce((previous, [key, value]: any[]) => {
    if (key === 'guid') {
      return previous;
    }
    return Object.assign({}, previous, {
      [key]: value[0]
    });
  }, {});

const entities = new AllHtmlEntities();

const formatArticle = (article: any): NewsArticle => {
  const description = article.description;
  const decodedDescription = entities.decode(description);
  const $ = cheerio.load(description);
  const thumbnailUrl = get(article, '[media:content]["$"]["url"]', null);
  const publisher = entities.decode($('font').html() || '');
  const fullCoverage = $('ol > li > strong > a').attr('href');

  const related: RelatedArticle[] = [];
  $('ol > li').each((index, element) => {
    const title = $(element)
      .find('a')
      .text();
    const link = $(element)
      .find('a')
      .attr('href');
    const relatedPublisher = $(element)
      .find('font')
      .text();
    related.push({
      title,
      link,
      publisher: relatedPublisher
    });
  });

  // Add publisher, re-formatted description, and url
  const formattedArticle = Object.assign(article, {
    description: decodedDescription,
    publisher,
    fullCoverage,
    related
  });

  // omit imgSrc if empty
  return thumbnailUrl
    ? Object.assign(formattedArticle, { thumbnailUrl })
    : formattedArticle;
};

export class Gnews {
  private base = 'https://news.google.com/news/rss';
  private defaultParams: any;
  constructor(
    defaultParams: any = {
      gl: 'US',
      ned: 'us',
      hl: 'en'
    }
  ) {
    this.defaultParams = defaultParams;
  }
  public headlines(topic?: string, extraParams: any = {}) {
    let url;
    if (topic) {
      url = `${this.base}/headlines/section/topic/${topic}`;
    } else {
      url = this.base;
    }
    return this.request(url, extraParams);
  }
  public search(q: string, extraParams: any = {}) {
    const url = `${this.base}/search/section/q/${q}/${q}`;
    return this.request(url, extraParams);
  }
  private request(url: string, extraParams: any = {}): Promise<NewsArticle[]> {
    return axios
      .get(url, {
        responseType: 'xml',
        params: Object.assign({}, this.defaultParams, extraParams)
      })
      .then(response => response.data)
      .then(xml => parseXml(xml)) // parse XML
      .then((obj: any) => obj.rss.channel[0].item) // retrieve articles
      .then(articles => (!!articles ? articles : []))
      .then(articles => articles.map(flattenArticles)) // flatten articles and omit guid
      .then(articles => articles.map(formatArticle)); // format articles
  }
}
