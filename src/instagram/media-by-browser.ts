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
    const initialData: MediaInitialData = await this.getWindowProperty('__initialData');
    if (initialData.pending) {
      throw new Error('Response is still pending!');
    }

    const postPages = initialData.data.entry_data.PostPage;
    if (postPages.length != 1) {
      throw new Error(`Got ${postPages.length} post pages!`);
    }

    return postPages[0];
  }

  async getMediaFrom_sharedData(): Promise<Media> {
    const sharedData: MediaSharedData = await this.getWindowProperty('_sharedData');

    const postPages = sharedData.entry_data.PostPage;
    if (postPages.length != 1) {
      throw new Error(`Got ${postPages.length} post pages!`);
    }

    return postPages[0];
  }

  private async getWindowProperty(propertyName: string): Promise<any> {
    const cacheKey = `${this.shortCode}${propertyName}.json`;

    if (this.useCache) {
      const string = await cache.get(cacheKey);
      if (string) {
        console.log('    Found cached response');
        const result = JSON.parse(string);
        return result;
      }
    }

    const page = await this.openMediaInBrowser();
    const result = await page.evaluate('window.' + propertyName);
    await cache.put(cacheKey, JSON.stringify(result));
    return result;
  }

  private async openMediaInBrowser(): Promise<Page> {
    if (this.openedPage) {
      console.log('    Media is already opened in browser');
      return this.openedPage;
    }

    console.log('    Opening media in browser');
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