import { Page } from 'puppeteer';

import { Cache } from '../cache';
import { Media } from './response-types/media';
import { MediaInitialData } from './response-types-browser/media__initialData';
import { MediaSharedData } from './response-types-browser/media_sharedData';
import { getBrowser } from '../browser';
import { waitAfterBrowserOpenedMediaToPreventBan } from './common';

const cache = new Cache('media-by-browser');

// This is ony for testing!
// This function is used in 'getMedia' function (media.ts).
export async function getMediaByBrowser(
  shortCode: string,
  useCache: boolean
): Promise<any> {
  console.log('Getting media by browser:', shortCode);

  const page = new MediaBrowserPage(shortCode, useCache);
  console.log('  Url:', page.url);

  console.log('  __initialData');
  await page.getMediaFrom__initialData();

  console.log('  _sharedData');
  await page.getMediaFrom_sharedData();
}

export class MediaBrowserPage {

  readonly shortCode: string;
  readonly url: string;
  private readonly useCache: boolean;
  private openedPage?: Page;

  constructor(shortCode: string, useCache: boolean) {
    this.shortCode = shortCode;
    this.url = `https://www.instagram.com/p/${shortCode}/`;
    this.useCache = useCache;
  }

  async getMediaFrom__initialData(): Promise<Media> {
    const propertyName = '__initialData';
    console.log('    Getting:', propertyName);

    const cacheKey = `${this.shortCode}${propertyName}.json`;
    const propertyValue: MediaInitialData = await this.getWindowProperty(propertyName, cacheKey);
    if (propertyValue.pending) {
      throw new Error('Response is still pending!');
    }

    const entry_data = propertyValue.data.entry_data;
    if (entry_data.LoginAndSignupPage) {
      const msg = 'Instagram returned LoginAndSignupPage';
      console.log(`      ${msg}`);
      throw new Error(msg);
    }

    const postPages = entry_data.PostPage;
    if (postPages.length != 1) {
      throw new Error(`Got ${postPages.length} post pages!`);
    }

    // Only when all of the validation succeded we can cache 'propertyValue'
    await cache.put(cacheKey, JSON.stringify(propertyValue));
    return postPages[0];
  }

  async getMediaFrom_sharedData(): Promise<Media> {
    const propertyName = '_sharedData';
    console.log('    Getting:', propertyName);

    const cacheKey = `${this.shortCode}${propertyName}.json`;
    const propertyValue: MediaSharedData = await this.getWindowProperty(propertyName, cacheKey);

    const entry_data = propertyValue.entry_data;
    if (entry_data.LoginAndSignupPage) {
      const msg = 'Instagram returned LoginAndSignupPage';
      console.log(`      ${msg}`);
      throw new Error(msg);
    }

    const postPages = entry_data.PostPage;
    if (postPages.length != 1) {
      throw new Error(`Got ${postPages.length} post pages!`);
    }

    // Only when all of the validation succeded we can cache 'propertyValue'
    await cache.put(cacheKey, JSON.stringify(propertyValue));
    return postPages[0];
  }

  private async getWindowProperty(propertyName: string, cacheKey: string): Promise<any> {
    if (this.useCache) {
      const string = await cache.get(cacheKey);
      if (string) {
        console.log('      Found cached data');
        const result = JSON.parse(string);
        return result;
      }
    }

    const page = await this.openBrowser();
    const result = await page.evaluate('window.' + propertyName);
    return result;
  }

  private async openBrowser(): Promise<Page> {
    if (this.openedPage) {
      console.log('      Browser is already opened');
      return this.openedPage;
    }

    console.log('      Opening browser');
    const browser = await getBrowser();

    const currentPages = await browser.pages();
    for (const page of currentPages) {
      await page.close();
    }

    const page = await browser.newPage();
    await page.goto(this.url);
    await waitAfterBrowserOpenedMediaToPreventBan();

    this.openedPage = page;
    return page;
  }
}
