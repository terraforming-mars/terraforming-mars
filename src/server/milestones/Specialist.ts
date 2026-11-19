import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Specialist extends BaseMilestone {
  public readonly automaDescription = 'Any track ≥ 10';
  constructor() {
    super(
      'Specialist',
      'Have 10 in production of any resource',
      10);
  }
  public getScore(player: IPlayer): number {
    return Math.max(player.production.megacredits,
      player.production.steel,
      player.production.titanium,
      player.production.plants,
      player.production.energy,
      player.production.heat);
  }

  /** MarsBot needs space 10 on any one of its tracks, Venus included (rulebook C p.9). */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.marsBotBoard.tracks.some((track) => track.position >= 10);
  }
}
