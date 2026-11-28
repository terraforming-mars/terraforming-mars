import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {numeric} from '@/common/utils/Ordering';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Visionary implements IAward {
  public readonly name = 'Visionary';
  public readonly description = 'Have the most cards in hand';
  public readonly automaDescription = 'Lowest track × 2 (second lowest with Venus)';

  public getScore(player: IPlayer): number {
    return player.cardsInHand.length;
  }

  /** Rulebook C p.15. */
  public marsBotScore(marsBot: IMarsBot): number {
    const positions = marsBot.marsBotBoard.tracks.map((track) => track.position).sort(numeric);
    const index = marsBot.game.gameOptions.expansions.venus ? 1 : 0;
    return positions[index] * 2;
  }
}
