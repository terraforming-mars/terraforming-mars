import {IAward} from './IAward';
import {Player} from '../Player';

export class Cultivator implements IAward {
  public name: string = 'Cultivator';
  public description: string = 'Most greenery tiles';
  public getScore(player: Player): number {
    return player.game.getGreeneriesCount(player);
  }
}
