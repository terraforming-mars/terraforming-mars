import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {PartyName} from '../turmoil/parties/PartyName';

export class SelectPartyToSendDelegate implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_PARTY_TO_SEND_DELEGATE;
    constructor(
        public title: string | Message,
        public buttonLabel: string = 'Send delegate',
        public availableParties: PartyName[],
        public cb: (party: PartyName) => undefined,
    ) {}
}
