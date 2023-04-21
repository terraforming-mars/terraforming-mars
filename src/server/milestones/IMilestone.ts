import {MilestoneName} from '../../common/ma/MilestoneName';
import {Player} from '../Player';

export interface IMilestone {
  name: MilestoneName;
  description: string;
  canClaim(player: Player): boolean;
  getScore(player: Player): number;
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

  public abstract getScore(player: Player): number;
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= this.threshold;
  }
}
