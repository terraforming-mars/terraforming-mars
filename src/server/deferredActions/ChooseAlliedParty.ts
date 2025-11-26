import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectOption} from '@/server/inputs/SelectOption';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';
import {message} from '@/server/logs/MessageBuilder';
import {IParty} from '@/server/turmoil/parties/IParty';
import {policyDescription} from '@/server/turmoil/Policy';

export class ChooseAlliedParty extends DeferredAction {
  constructor(
    player: IPlayer,
    public parties: ReadonlyArray<IParty>,
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

    return new OrOptions(...alliedOptions)
      .setTitle(message('Select an allied party'));
  }

  private partyDescription(party: IParty, _player: IPlayer) {
    const description = policyDescription(party.policies[0], undefined);
    return `[${party.name}] - Bonus: ${party.bonuses[0].description} -  Policy: ${description}`;
  }
}
