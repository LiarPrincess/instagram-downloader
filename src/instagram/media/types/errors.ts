export type GetMediaErrorArg =
  { kind: 'MissingMedia' } |
  { kind: 'ProfileIsPrivate', username: string } |
  { kind: 'RequestsTemporaryDisabled' } |
  { kind: 'Unknown' }
  ;

export class GetMediaError extends Error {

  readonly arg: GetMediaErrorArg;
  readonly allFollowingRequestsWillAlsoFail: boolean;

  constructor(arg: GetMediaErrorArg) {
    let message: string;
    let allFollowingRequestsWillAlsoFail: boolean;

    switch (arg.kind) {
      case 'MissingMedia':
        message = 'Media is no longer available';
        allFollowingRequestsWillAlsoFail = true;
        break;
      case 'ProfileIsPrivate':
        message = `Profile '${arg.username}' is private`;
        allFollowingRequestsWillAlsoFail = true;
        break;
      case 'RequestsTemporaryDisabled':
        message = 'Requests are temporary disabled (login required or just wait a few minutes/hours)';
        allFollowingRequestsWillAlsoFail = false;
        break;
      case 'Unknown':
        message = 'Unknown error';
        allFollowingRequestsWillAlsoFail = false;
    }

    super(message);
    this.allFollowingRequestsWillAlsoFail = allFollowingRequestsWillAlsoFail;
    this.arg = arg;
  }
}
