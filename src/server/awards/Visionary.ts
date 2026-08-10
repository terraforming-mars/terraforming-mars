import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotAllTrackPositions} from '../automa/MarsBotMilestoneAwardEval';

export class Visionary implements IAward {
  public readonly name = 'Visionary';
  public readonly description = 'Have the most cards in hand';

  public getScore(player: IPlayer): number {
    return player.cardsInHand.length;
  }

  /** The automa rules double MarsBot's least advanced track, second least with Venus. */
  public marsBotScore(bot: IMarsBot): number {
    const positions = marsBotAllTrackPositions(bot).sort((a, b) => a - b);
    const index = bot.game.gameOptions.venusNextExtension ? 1 : 0;
    return positions[index] * 2;
  }
}
