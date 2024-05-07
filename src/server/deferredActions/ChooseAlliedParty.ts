import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {message} from '../logs/MessageBuilder';
import {IParty} from '../turmoil/parties/IParty';

export class ChooseAlliedParty extends DeferredAction {
  constructor(
    player: IPlayer,
    public parties: Array<IParty>,
    public partyCb: (party: IParty) => void,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute(): PlayerInput {
    const alliedOptions = this.parties.map((party) => {
      return new SelectOption(this.partyDescription(party, this.player),
        'Select')
        .andThen(() => {
          this.partyCb(party);
          return undefined;
        });
    });
    const orPolicies = new OrOptions(...alliedOptions);
    orPolicies.title = message('Select an allied party');

    return orPolicies;
  }

  private partyDescription(party: IParty, _player: IPlayer) {
    return `[${party.name}] - Bonus: ${party.bonuses[0].description} -  Policy: ${party.policies[0].description}`;
  }
}
