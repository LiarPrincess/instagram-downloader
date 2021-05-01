export const seconds = 1000;

// Media

export async function waitAfterMediaRequestToPreventBan() {
  await wait(10 * seconds);
}

// Media - browser

export async function waitAfterBrowserOpenedMediaToPreventBan() {
  await wait(5 * seconds);
}

// Saved

export async function waitAfterSavedMediaRequestToPreventBan() {
  await wait(2 * seconds);
}

// Profile

export async function waitAfterProfileRequestToPreventBan() {
  await wait(2 * seconds);
}

export async function waitAfterProfileMediaRequestToPreventBan() {
  await wait(2 * seconds);
}

// Helpers

function wait(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
