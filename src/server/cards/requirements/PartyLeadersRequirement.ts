import {IPlayer} from '../../IPlayer';
import {Turmoil} from '../../turmoil/Turmoil';
import {InequalityRequirement} from './InequalityRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class PartyLeadersRequirement extends InequalityRequirement {
  public readonly type = RequirementType.PARTY_LEADERS;
  public override getScore(player: IPlayer): number {
    const turmoil = Turmoil.getTurmoil(player.game);
    return turmoil.parties.filter((party) => party.partyLeader === player).length;
  }
}
