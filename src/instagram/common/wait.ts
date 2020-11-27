export const seconds = 1000;

export function waitAfterRequestToPreventBan(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
