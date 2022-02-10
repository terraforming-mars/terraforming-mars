import {Message} from '../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {PartyName} from '../common/turmoil/PartyName';

export class SelectPartyToSendDelegate implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_PARTY_TO_SEND_DELEGATE;
  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Send delegate',
        public availableParties: PartyName[],
        public cb: (party: PartyName) => undefined,
  ) {}
}
