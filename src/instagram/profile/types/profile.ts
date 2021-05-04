export interface Profile {
  readonly id: string;
  readonly fullName: string;
  readonly username: string;
  readonly biography: string;
  readonly isPrivate: boolean;

  readonly profilePic: {
    url: string,
    hdUrl: string
  };

  readonly followersCount: number;
  readonly followingCount: number;
  readonly postCount: number;
}
