import {IPlayer} from '../IPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {AresHazards} from '../ares/AresHazards';
import {TileType} from '../../common/TileType';
import {Message} from '../../common/logs/Message';
import {message} from '../logs/MessageBuilder';
import {Space} from '../boards/Space';
import {LogHelper} from '../LogHelper';

export class PlaceHazardTile extends DeferredAction<Space> {
  constructor(
    player: IPlayer,
    public hazardType: TileType.DUST_STORM_MILD | TileType.EROSION_MILD,
    private options?: {
      title?: string | Message,
      spaces?: ReadonlyArray<Space>,
    }) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const availableSpaces = this.options?.spaces ?? this.player.game.board.getAvailableSpacesForType(this.player, 'land');
    if (availableSpaces.length === 0) {
      return undefined;
    }
    const hazardType = this.hazardType;
    const title = this.options?.title || message('Select space for ${0}', (b) => b.tileType(hazardType));

    return new SelectSpace(title, availableSpaces)
      .andThen((space) => {
        AresHazards.putHazardAt(space, hazardType);
        LogHelper.logTilePlacement(this.player, space, this.hazardType);
        this.cb(space);
        return undefined;
      });
  }
}

