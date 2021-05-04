export class PrivateProfileError extends Error {

  readonly username: string;

  constructor(username: string) {
    super();
    this.message = `Profile '${username}' is private`;
    this.username = username;
  }
}

export class LoginRequiredError extends Error {

  constructor() {
    super();
    this.message = 'Login required (or just wait a few minutes/hours)';
  }
}
