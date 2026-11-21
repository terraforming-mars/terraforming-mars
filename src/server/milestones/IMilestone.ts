import {MilestoneName} from '../../common/ma/MilestoneName';
import {BoardName} from '../../common/boards/BoardName';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/IMarsBot';

export interface IMilestone {
  name: MilestoneName;
  description: string;
  canClaim(player: IPlayer): boolean;
  getScore(player: IPlayer): number;
  /** How MarsBot meets the criteria. */
  automaDescription?: string;
  /** The automa description for this milestone, when played on certain maps. */
  automaMapDescriptions?: Partial<Record<BoardName, string>>;
  /**
   * Whether MarsBot meets the criteria.
   *
   * Only for milestones where the automa rules differ from `canClaim` for MarsBot's player.
   */
  marsBotCanClaim?(bot: IMarsBot): boolean;
  /** How far the player is from claiming this: 0 when they qualify. Left out when it can't be counted. */
  remaining?(player: IPlayer): number;
}

export abstract class BaseMilestone implements IMilestone {
  public readonly name: MilestoneName;
  public readonly description: string;
  public readonly threshold: number;

  constructor(name: MilestoneName, description: string, threshold: number) {
    this.name = name;
    this.description = description;
    this.threshold = threshold;
  }

  public abstract getScore(player: IPlayer): number;
  public canClaim(player: IPlayer): boolean {
    return this.getScore(player) >= this.threshold;
  }
  public remaining(player: IPlayer): number {
    return Math.max(0, this.threshold - this.getScore(player));
  }
}
