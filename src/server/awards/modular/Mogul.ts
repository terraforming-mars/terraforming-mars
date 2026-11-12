import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {IMarsBot} from '@/server/automa/IMarsBot';
export class Mogul implements IAward {
  public readonly name = 'Mogul';
  public readonly description = 'Have the highest production (excluding M€) combined';
  public readonly automaDescription = 'Highest track × 2';

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium + player.production.plants + player.production.energy + player.production.heat;
  }

  /** Scores MarsBot's most advanced track doubled (rulebook C p.9 and p.15). */
  public marsBotScore(marsBot: IMarsBot): number {
    return Math.max(...marsBot.marsBotBoard.tracks.map((track) => track.position)) * 2;
  }
}
