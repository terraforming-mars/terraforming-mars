import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {IColony} from '../colonies/IColony';
import {InputResponse} from '../../common/inputs/InputResponse';
import {Player} from '../Player';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColoniesHandler} from '../colonies/ColoniesHandler';

export class SelectColony implements PlayerInput {
  public readonly inputType = PlayerInputType.SELECT_COLONY;

  constructor(
        public title: string | Message,
        public buttonLabel: string = 'Save',
        public colonies: Array<IColony>,
        public cb: (colony: IColony) => PlayerInput | undefined,
  ) {
    this.buttonLabel = buttonLabel;
  }

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 1);
    const colonyName: ColonyName = (input[0][0]) as ColonyName;
    if (colonyName === undefined) {
      throw new Error('No colony selected');
    }
    // TODO(kberg): this passes true because SelectColony sometimes loads discarded colonies
    // but that can be a parameter, and that would be useful.
    const colony = ColoniesHandler.getColony(player.game, colonyName, true);
    return this.cb(colony);
  }
}
