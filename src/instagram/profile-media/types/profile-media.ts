export type ProfileMedia = ProfileGraphImage | ProfileGraphSidecar | ProfileGraphVideo;

export interface Common {
  readonly id: string;
  readonly shortCode: string;
  readonly takenAt: Date;

  readonly likeCount: number;
  readonly commentCount: number;
}

export interface ProfileGraphImage extends Common {
  readonly type: 'GraphImage';
  readonly displayUrl: string;
}

export interface ProfileGraphSidecar extends Common {
  readonly type: 'GraphSidecar';
}

export interface ProfileGraphVideo extends Common {
  readonly type: 'GraphVideo';
}
