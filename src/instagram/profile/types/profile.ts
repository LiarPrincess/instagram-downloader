export class Profile {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly username: string,
    public readonly biography: string,
    public readonly isPrivate: boolean,

    public readonly profilePic: {
      url: string,
      urlHd: string
    },

    public readonly followersCount: number,
    public readonly followingCount: number,
    public readonly postCount: number,
  ) { }
}
