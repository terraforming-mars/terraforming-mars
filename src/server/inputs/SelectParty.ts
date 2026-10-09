import {Message} from '../../common/logs/Message';
import {BasePlayerInput} from '../PlayerInput';
import {PartyName} from '../../common/turmoil/PartyName';
import {InputResponse, isSelectPartyResponse} from '../../common/inputs/InputResponse';
import {SelectPartyModel} from '../../common/models/PlayerInputModel';
import {InputError} from './InputError';

export class SelectParty extends BasePlayerInput<PartyName> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Send delegate',
    public parties: Array<PartyName>) {
    super('party', title);
    this.buttonLabel = buttonLabel;
  }

  public override toModel(): SelectPartyModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'party',
      parties: this.parties,
    };
  }

  public process(input: InputResponse) {
    if (!isSelectPartyResponse(input)) {
      throw new InputError('Not a valid SelectPartyResponse');
    }
    if (!this.parties.includes(input.partyName)) {
      throw new InputError('Invalid party selected');
    }
    return this.cb(input.partyName);
  }
}
