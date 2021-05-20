
import {IGameLoader} from './IGameLoader';
import {Phase} from '../Phase';

export class GarbageCollector {
  private interval?: NodeJS.Timeout;
  constructor(private gameLoader: IGameLoader) {
  }
  public start(): void {
    this.interval = global.setInterval(() => {
      this.run();
    }, 1000 * 60 * 60 /* every hour */);
  }
  protected run(): void {
    console.log('Running garbage collector');
    this.gameLoader.getLoadedGames().forEach((game, gameId) => {
      if (game !== undefined && game.phase === Phase.END) {
        console.log(`GarbageCollector: Removing ${gameId} from game loader`);
        this.gameLoader.remove(gameId);
      }
    });
  }
  public stop(): void {
    if (this.interval !== undefined) {
      global.clearInterval(this.interval);
    }
  }
}
