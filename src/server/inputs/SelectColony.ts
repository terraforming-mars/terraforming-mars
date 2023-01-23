import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {IColony} from '../colonies/IColony';
import {InputResponse, isSelectColonyResponse} from '../../common/inputs/InputResponse';
import {PlayerInputModel} from '../../common/models/PlayerInputModel';
import {Player} from '../Player';

export class SelectColony extends BasePlayerInput {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    public colonies: Array<IColony>,
    public cb: (colony: IColony) => PlayerInput | undefined,
  ) {
    super(PlayerInputType.SELECT_COLONY, title);
    this.buttonLabel = buttonLabel;
  }

  public override toModel(model: PlayerInputModel, player: Player) {
    const game = player.game;
    model.coloniesModel = this.colonies.map(
      (colony) => ({
        colonies: colony.colonies.map(
          (playerId) => game.getPlayerById(playerId).color,
        ),
        isActive: colony.isActive,
        name: colony.name,
        trackPosition: colony.trackPosition,
        visitor: colony.visitor === undefined ? undefined : game.getPlayerById(colony.visitor).color,
      }),
    );
  }

  public process(input: InputResponse) {
    if (!isSelectColonyResponse(input)) {
      throw new Error('Not a valid SelectColonyResponse');
    }
    if (input.colonyName === undefined) {
      throw new Error('No colony selected');
    }
    const colony = this.colonies.find((c) => c.name === input.colonyName);
    if (colony === undefined) {
      throw new Error(`Colony ${input.colonyName} not found`);
    }
    return this.cb(colony);
  }
}
