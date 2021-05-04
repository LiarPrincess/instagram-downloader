export type Media = GraphImage | GraphSidecar | GraphVideo;

export interface Common {
  readonly id: string;
  readonly shortCode: string;
  readonly owner: Owner;
  readonly takenAt: Date;

  readonly likeCount: number;
  readonly commentCount: number;
}

export interface Owner {
  readonly id: string;
  readonly username: string;
  readonly full_name: string;
  readonly profilePicUrl: string;
}

export interface GraphImage extends Common {
  readonly type: 'GraphImage';
  readonly displayUrl: string;
  readonly sources: ImageSource[];
}

export interface GraphSidecar extends Common {
  readonly type: 'GraphSidecar';
  readonly children: GraphSidecarChild[];
}

export type GraphSidecarChild = GraphSidecarImage | GraphSidecarVideo;

export interface GraphSidecarImage {
  readonly type: 'GraphImage';
  readonly id: string;
  readonly shortCode: string;
  readonly displayUrl: string;
  readonly sources: ImageSource[];
}

export interface GraphSidecarVideo {
  readonly type: 'GraphVideo';
  readonly id: string;
  readonly shortCode: string;
  readonly videoUrl: string;
}

export interface GraphVideo extends Common {
  readonly type: 'GraphVideo';
  readonly videoUrl: string;
}

export interface ImageSource {
  readonly url: string;
  readonly width: number;
  readonly height: number;
}
