import {IPartyCardRequirement} from '../../../common/cards/ICardRequirement';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IPlayer} from '../../IPlayer';
import {Turmoil} from '../../turmoil/Turmoil';
import {CardRequirement} from './CardRequirement';
import {RequirementType} from '../../../common/cards/RequirementType';

export class PartyRequirement extends CardRequirement implements IPartyCardRequirement {
  public readonly type = RequirementType.PARTY;
  constructor(public readonly party: PartyName) {
    super();
    this.party = party;
  }
  public satisfies(player: IPlayer): boolean {
    return Turmoil.getTurmoil(player.game).canPlay(player, this.party);
  }
}
