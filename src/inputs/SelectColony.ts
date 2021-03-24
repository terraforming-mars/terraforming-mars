
import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {ColonyName} from '../colonies/ColonyName';
import {ColonyModel} from '../models/ColonyModel';
import {Player} from '../Player';

export class SelectColony implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_COLONY;

  constructor(
    public title: string | Message,
    public buttonLabel: string = 'Save',
    public coloniesModel: Array<ColonyModel>,
    public cb: (colony: ColonyName) => undefined,
  ) {
    this.buttonLabel = buttonLabel;
  }

  public runInput(player: Player, input: ReadonlyArray<ReadonlyArray<string>>): void {
    PlayerInput.checkInputLength(input, 1, 1);
    const colony: ColonyName = (input[0][0]) as ColonyName;
    if (colony === undefined) {
      throw new Error('No colony selected');
    }
    player.runInputCb(this.cb(colony));
  }
}
