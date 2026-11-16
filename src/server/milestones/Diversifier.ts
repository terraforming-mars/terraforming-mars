import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Diversifier extends BaseMilestone {
  public readonly automaDescription = 'Space 3+ on every track (7 of 8 with Venus)';
  constructor() {
    super(
      'Diversifier',
      'Have 8 different tags in play',
      8);
  }
  public getScore(player: IPlayer): number {
    return player.tags.distinctCount('milestone');
  }

  /**
   * MarsBot needs space 3 on 7 of its tracks.
   *
   * That is every track without Venus, as Hellas asks (rulebook C p.9), and 7 of 8 with it
   * (rulebook C p.2), which is also the Milestones & Awards expansion's rule (rulebook C p.13).
   */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return bot.marsBotBoard.tracks.filter((track) => track.position >= 3).length >= 7;
  }
}
