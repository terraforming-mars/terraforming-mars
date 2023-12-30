import {IPlayer} from '../../IPlayer';
import {RequirementType} from '../../../common/cards/RequirementType';
import {InequalityRequirement} from './InequalityRequirement';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

/**
 * Evaluates whether this player has excavated a given number of tiles.
 */
export class ExcavationRequirement extends InequalityRequirement {
  public readonly type = RequirementType.EXCAVATION;

  public getScore(player: IPlayer): number {
    return UnderworldExpansion.excavationMarkerCount(player);
  }
}

