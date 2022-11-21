import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {PartyName} from '../../common/turmoil/PartyName';
import {InputResponse, isSelectPartyResponse} from '../../common/inputs/InputResponse';

// TODO(kberg): Rename to SelectParty
export class SelectPartyToSendDelegate implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_PARTY_TO_SEND_DELEGATE;
  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Send delegate',
        public availableParties: PartyName[],
        public cb: (party: PartyName) => undefined,
  ) {}

  public process(input: InputResponse) {
    if (!isSelectPartyResponse(input)) {
      throw new Error('Not a valid SelectPartyResponse');
    }
    if (input.partyName === undefined) {
      throw new Error('No party selected');
    }
    if (!this.availableParties.includes(input.partyName)) {
      throw new Error('Invalid party selected');
    }
    return this.cb(input.partyName);
  }
}
