import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';

export class CosmicSettler implements IAward {
  public readonly name = 'Cosmic Settler';
  public readonly description = 'Having the most city tiles not on Mars';
  public getScore(player: Player): number {
    const score = player.game.getCitiesOffMarsCount(player);
    return score + getAdditionalScore(player);
  }
}
