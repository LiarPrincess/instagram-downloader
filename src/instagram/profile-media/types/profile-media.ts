export type ProfileMediaData =
  { type: 'GraphImage'; displayUrl: string } |
  { type: 'GraphSidecar' } |
  { type: 'GraphVideo' };

export class ProfileMedia {
  constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly takenAt: Date,
    public readonly data: ProfileMediaData,
    public readonly likeCount: number,
    public readonly commentCount: number,
  ) { }
}
