import * as instagram from './instagram';
import {
  downloadSavedMedia,
  downloadAllMediaFromProfile
} from './scenarios';

const outputDir = './output';

(async () => {
  try {
    const guestAuth = await instagram.authenticateAsGuest();

    // You can get them from cookies in the browser
    const browserAuth = {
      sessionId: '',
      csrfToken: ''
    };

    // === Profile ===
    const username = 'dd_toys__';
    await downloadAllMediaFromProfile(guestAuth, username, outputDir, true);

    // === Saved ===
    const myUsername = '';
    const lastShortCodes: string[] = [
    ];

    const useCache = true;
    await downloadSavedMedia(
      guestAuth,
      browserAuth,
      myUsername,
      outputDir,
      useCache,
      lastShortCodes
    );

    console.log('Finished');
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
})();
