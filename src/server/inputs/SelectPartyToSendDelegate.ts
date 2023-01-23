import {Message} from '../../common/logs/Message';
import {BasePlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {PartyName} from '../../common/turmoil/PartyName';
import {InputResponse, isSelectPartyResponse} from '../../common/inputs/InputResponse';
import {getTurmoilModel} from '../models/TurmoilModel';
import {PlayerInputModel} from '../../common/models/PlayerInputModel';
import {Player} from '../Player';

// TODO(kberg): Rename to SelectParty
export class SelectPartyToSendDelegate extends BasePlayerInput {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Send delegate',
    public availableParties: PartyName[],
    public cb: (party: PartyName) => undefined,
  ) {
    super(PlayerInputType.SELECT_PARTY_TO_SEND_DELEGATE, title);
    this.buttonLabel = buttonLabel;
  }

  public override toModel(model: PlayerInputModel, player: Player) {
    model.availableParties = this.availableParties;
    // TODO(kberg): why this conditional?
    if (player.game !== undefined) {
      model.turmoil = getTurmoilModel(player.game);
    }
  }

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
