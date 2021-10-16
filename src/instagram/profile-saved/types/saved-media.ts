export type SavedMediaData =
  { type: 'GraphImage'; displayUrl: string } |
  { type: 'GraphSidecar' } |
  { type: 'GraphVideo' };

export class SavedMedia {
  constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly takenAt: Date,
    public readonly ownerId: string,
    public readonly data: SavedMediaData,
    public readonly likeCount: number
  ) { }
}
