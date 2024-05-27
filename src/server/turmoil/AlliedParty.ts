import {Agenda} from '../../common/turmoil/Types';
import {PartyName} from '../../common/turmoil/PartyName';

/** When player has Mars Frontier Alliance, this is their political party alliance. */
export type AlliedParty = {
  partyName: PartyName;
  agenda: Agenda;
};
