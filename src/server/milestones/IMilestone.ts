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
}
