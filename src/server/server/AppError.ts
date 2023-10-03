import {AppErrorId} from '../../common/app/AppErrorId';

export class AppError extends Error {
  public id: AppErrorId;
  constructor(id: AppErrorId, message?: string) {
    super(message);
    this.id = id;
  }
}
