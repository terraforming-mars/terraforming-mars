import {Database} from '../database/Database';

export class DatabaseMaintenance {
  private static task() {
    console.log('Starting database maintenance');
    Database.getInstance().purgeUnfinishedGames();
    console.log('Finished database maintenance');
  }

  public static initialize() {
    const fifteenMinutesInMilliseconds = 15 * 60 * 1000;
    setInterval(() => DatabaseMaintenance.task(), fifteenMinutesInMilliseconds);
  }
}
