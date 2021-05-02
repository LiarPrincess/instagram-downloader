import { platform } from 'os';
import { Browser, launch as launchBrowser } from 'puppeteer';

let _browser: Browser | undefined;

export async function getBrowser(): Promise<Browser> {
  if (_browser) {
    return _browser;
  }

  _browser = await launchBrowser({
    defaultViewport: {
      width: 1280,
      height: 720
    },
    headless: false // platform() == 'linux' ? true : false
  });

  return _browser;
}

export async function closeBrowser(): Promise<void> {
  if (!_browser) {
    return;
  }

  const pages = await _browser.pages();
  for (const page of pages) {
    await page.close();
  }

  await _browser.close();
}
