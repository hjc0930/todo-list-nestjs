export class UserVo {
  id: number;
  userName: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserVo>) {
    Object.assign(this, partial);
  }
}
