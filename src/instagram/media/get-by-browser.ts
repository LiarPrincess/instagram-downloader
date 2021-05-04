import { Page } from 'puppeteer';

import { Cache } from '../../cache';
import { getBrowser } from '../../browser';
import { waitAfterBrowserOpenedMediaToPreventBan } from '../common';
import {
  ApiResponse,
  BrowserInitialData, BrowserSharedData,
  LoginRequiredError, PrivateProfileError
} from './types';

const cache = new Cache('media-by-browser');

export async function getByBrowser__initialData(
  shortCode: string,
  useCache: boolean
): Promise<ApiResponse.Root> {
  const propertyName = '__initialData';
  const propertyValue: BrowserInitialData.Root = await getWindowProperty(shortCode, propertyName, useCache);
  if (propertyValue.pending) {
    throw new Error('Response is still pending!');
  }

  const entryData = propertyValue.data.entry_data;
  throwIfLoginPage(entryData);
  throwIfPrivateProfile(entryData);

  const postPages = entryData.PostPage;
  if (postPages.length != 1) {
    throw new Error(`Got ${postPages.length} post pages!`);
  }

  // Only when all of the validation succeded we can cache the value
  const cacheKey = createCacheKey(shortCode, propertyName);
  await cache.put(cacheKey, JSON.stringify(propertyValue));
  return postPages[0];
}

export async function getByBrowser_sharedData(
  shortCode: string,
  useCache: boolean
): Promise<ApiResponse.Root> {
  const propertyName = '_sharedData';
  const propertyValue: BrowserSharedData.Root = await getWindowProperty(shortCode, propertyName, useCache);

  const entryData = propertyValue.entry_data;
  throwIfLoginPage(entryData);
  throwIfPrivateProfile(entryData);

  const postPages = entryData.PostPage;
  if (postPages.length != 1) {
    throw new Error(`Got ${postPages.length} post pages!`);
  }

  // Only when all of the validation succeded we can cache the value
  const cacheKey = `${shortCode}${propertyName}.json`;
  await cache.put(cacheKey, JSON.stringify(propertyValue));
  return postPages[0];
}

/* ==================== */
/* === Get property === */
/* ==================== */

async function getWindowProperty(
  shortCode: string,
  propertyName: string,
  useCache: boolean
): Promise<any> {
  if (useCache) {
    const cacheKey = createCacheKey(shortCode, propertyName);
    const string = await cache.get(cacheKey);
    if (string) {
      return JSON.parse(string);
    }
  }

  const url = `https://www.instagram.com/p/${shortCode}/`;
  const page = await getExistingTabOrOpenNew(url);
  const result = await page.evaluate('window.' + propertyName);
  return result;
}

function createCacheKey(shortCode: string, propertyName: string): string {
  return `${shortCode}${propertyName}.json`;
}

async function getExistingTabOrOpenNew(url: string): Promise<Page> {
  const browser = await getBrowser();

  const openedPages = await browser.pages();
  for (const page of openedPages) {
    const pageUrl = page.url();
    if (pageUrl == url) {
      return page;
    }

    // We are safe to close this page.
    await page.close();
  }

  const page = await browser.newPage();
  await page.goto(url);
  await waitAfterBrowserOpenedMediaToPreventBan();
  return page;
}

/* ============== */
/* === Errors === */
/* ============== */

function throwIfLoginPage(entryData: BrowserInitialData.EntryData | BrowserSharedData.EntryData) {
  const loginAndSignupPage = entryData.LoginAndSignupPage;
  if (!loginAndSignupPage) {
    return;
  }

  throw new LoginRequiredError();
}

function throwIfPrivateProfile(entryData: BrowserInitialData.EntryData | BrowserSharedData.EntryData) {
  const profilePages = entryData.ProfilePage;
  if (!profilePages) {
    return;
  }

  if (profilePages.length != 1) {
    throw new Error(`Found ${profilePages.length} profiles (expected 1)`);
  }

  const profile = profilePages[0].graphql.user;
  if (profile.is_private) {
    throw new PrivateProfileError(profile.username);
  }
}
