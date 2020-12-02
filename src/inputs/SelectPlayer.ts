
import {DynamicTranslatableStringModel} from '../models/DynamicTranslatableStringModel';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {PlayerInputTypes} from '../PlayerInputTypes';

export class SelectPlayer implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_PLAYER;
    constructor(public players: Array<Player>, public title: string | DynamicTranslatableStringModel, public buttonLabel: string = 'Save', public cb: (player: Player) => PlayerInput | undefined) {
      this.buttonLabel = buttonLabel;
    }
}
