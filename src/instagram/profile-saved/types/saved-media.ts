export type SavedMedia = SavedGraphImage | SavedGraphSidecar | SavedGraphVideo;

export interface Common {
  readonly id: string;
  readonly shortCode: string;
  readonly takenAt: Date;
  readonly ownerId: string;
  readonly likeCount: number;
}

export interface SavedGraphImage extends Common {
  readonly type: 'GraphImage';
  readonly displayUrl: string;
}

export interface SavedGraphSidecar extends Common {
  readonly type: 'GraphSidecar';
}

export interface SavedGraphVideo extends Common {
  readonly type: 'GraphVideo';
}
