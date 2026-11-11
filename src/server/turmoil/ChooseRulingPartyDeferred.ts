import {IPlayer} from '../IPlayer';
import {DeferredAction} from '../deferredActions/DeferredAction';
import {SelectParty} from '../inputs/SelectParty';
import {Turmoil} from './Turmoil';
import {PoliticalAgendas} from './PoliticalAgendas';
import {IParty} from './parties/IParty';

export class ChooseRulingPartyDeferred extends DeferredAction<IParty> {
  private turmoil: Turmoil;
  constructor(player: IPlayer) {
    super(player);
    this.turmoil = Turmoil.getTurmoil(player.game);
  }

  public execute() {
    const partyNames = this.turmoil.parties.map((p) => p.name);
    return new SelectParty('Select new ruling party', 'Select', partyNames)
      .andThen((partyName) => {
        const party = this.turmoil.getPartyByName(partyName);
        this.turmoil.rulingPolicy().onPolicyEnd?.(this.player.game);
        this.turmoil.rulingParty = party;
        this.player.game.log('The ruling party is: ${0}', (b) => b.partyName(party.name));
        PoliticalAgendas.setNextAgenda(this.turmoil, this.player.game);
        this.cb(party);
        return undefined;
      });
  }
}
