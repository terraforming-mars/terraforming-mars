import {IPlayer} from '@/server/IPlayer';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {InequalityRequirement} from '@/server/cards/requirements/InequalityRequirement';
import {RequirementType} from '@/common/cards/RequirementType';

/**
 * Evaluate whether the number of Turmoil parties a player leads is at least (or at most) a given value.
 */
export class PartyLeadersRequirement extends InequalityRequirement {
  public readonly type = RequirementType.PARTY_LEADERS;
  public override getScore(player: IPlayer): number {
    const turmoil = Turmoil.getTurmoil(player.game);
    return turmoil.parties.filter((party) => party.partyLeader === player).length;
  }
}
