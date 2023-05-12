import {IAward} from './IAward';
import {Player} from '../Player';

export class CosmicSettler implements IAward {
  public readonly name = 'Cosmic Settler';
  public readonly description = 'Own the most cities not on Mars';
  public getScore(player: Player): number {
    return player.game.getCitiesOffMarsCount(player);
  }
}
