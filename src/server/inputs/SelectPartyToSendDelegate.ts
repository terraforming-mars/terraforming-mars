import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {PartyName} from '../../common/turmoil/PartyName';
import {InputResponse} from '../../common/inputs/InputResponse';
import {Player} from '../Player';

// TODO(kberg): Rename to SelectParty
export class SelectPartyToSendDelegate implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_PARTY_TO_SEND_DELEGATE;
  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Send delegate',
        public availableParties: PartyName[],
        public cb: (party: PartyName) => undefined,
  ) {}

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 1);
    const party: PartyName = (input[0][0]) as PartyName;
    if (party === undefined) {
      throw new Error('No party selected');
    }
    return this.cb(party);
  }
}
