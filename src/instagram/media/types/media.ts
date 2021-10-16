export class MediaOwner {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly full_name: string,
    public readonly profilePicUrl: string
  ) { }
}

export type MediaData =
  { type: 'GraphImage', displayUrl: string, sources: ImageSource[] } |
  { type: 'GraphSidecar', children: MediaSidecarChild[] } |
  { type: 'GraphVideo', videoUrl: string };

export class Media {
  constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly owner: MediaOwner,
    public readonly takenAt: Date,
    public readonly data: MediaData,
    public readonly likeCount: number,
    public readonly commentCount: number
  ) { }
}

export type MediaSidecarChild = MediaSidecarImage | MediaSidecarVideo;

export class MediaSidecarVideo {
  public readonly type = 'GraphVideo';
  constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly videoUrl: string
  ) { }
}

export class MediaSidecarImage {
  public readonly type = 'GraphImage';
  constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly displayUrl: string,
    public readonly sources: ImageSource[]
  ) { }
}

export interface ImageSource {
  readonly url: string;
  readonly width: number;
  readonly height: number;
}
