import {Message} from '../Message';
import {Player} from '../Player';
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

    public runInput(player: Player, input: ReadonlyArray<ReadonlyArray<string>>) {
      PlayerInput.checkInputLength(input, 1, 1);
      const party: PartyName = (input[0][0]) as PartyName;
      if (party === undefined) {
        throw new Error('No party selected');
      }
      player.runInputCb(this.cb(party));
    }
}
