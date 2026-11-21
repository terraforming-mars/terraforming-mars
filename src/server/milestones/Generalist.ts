import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {Tag} from '../../common/cards/Tag';

export class Generalist extends BaseMilestone {
  public readonly automaDescription = 'All tracks ≥ 2 (except Venus)';
  constructor() {
    super(
      'Generalist',
      'Have increased all 6 productions by 1 step',
      6);
  }

  public getScore(player: IPlayer): number {
    let score = 0;
    const requiredProduction = player.game.gameOptions.corporateEra ? 0 : 1;

    if (player.production.megacredits > requiredProduction) {
      score++;
    }
    if (player.production.steel > requiredProduction) {
      score++;
    }
    if (player.production.titanium > requiredProduction) {
      score++;
    }
    if (player.production.plants > requiredProduction) {
      score++;
    }
    if (player.production.energy > requiredProduction) {
      score++;
    }
    if (player.production.heat > requiredProduction) {
      score++;
    }

    return score;
  }

  /**
   * MarsBot needs space 2 on every track except Venus.
   *
   * That is every track on Elysium (rulebook C p.9), leaving out Venus when in play (rulebook C p.2),
   * which is also the Milestones & Awards expansion's rule (rulebook C p.13).
   */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.marsBotBoard.tracks
      .filter((track) => !track.definition.tags.includes(Tag.VENUS))
      .every((track) => track.position >= 2);
  }
}
