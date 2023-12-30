import {PartyName} from '../../../common/turmoil/PartyName';
import {IPlayer} from '../../IPlayer';
import {Turmoil} from '../../turmoil/Turmoil';
import {CardRequirement} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';


/**
 * Evaluate whether a player can satisfy a Turmoil party requirement.
 *
 * A player satisfies a party requirement if the party is currently ruling, or if
 * contains two of the player's delegates.
 */
export class PartyRequirement extends CardRequirement {
  public readonly type = RequirementType.PARTY;
  constructor(public readonly party: PartyName) {
    super();
  }

  public satisfies(player: IPlayer): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    if (turmoil.rulingParty.name === this.party) {
      return true;
    }

    const party = turmoil.getPartyByName(this.party);
    return party.delegates.count(player) >= 2;
  }
}
