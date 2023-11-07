import {IPlayer} from '../IPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {DeferredAction, Priority} from './DeferredAction';
import {PlacementType} from '../boards/PlacementType';
import {Space} from '../boards/Space';

type Options = {
  title?: string,
  on?: PlacementType,
  spaces?: Array<Space>,
};

export class PlaceOceanTile extends DeferredAction<Space> {
  constructor(
    player: IPlayer,
    private options: Options = {}) {
    super(player, Priority.PLACE_OCEAN_TILE);
  }

  public execute() {
    if (!this.player.game.canAddOcean()) {
      return undefined;
    }

    let title = this.options.title ?? this.getTitle('ocean');
    let availableSpaces: ReadonlyArray<Space> = [];
    if (this.options.spaces !== undefined) {
      availableSpaces = this.options.spaces;
    } else {
      const on = this.options?.on || 'ocean';
      availableSpaces = this.player.game.board.getAvailableSpacesForType(this.player, on);
      title = this.options?.title ?? this.getTitle(on);
    }

    return new SelectSpace(title, availableSpaces)
      .andThen((space) => {
        this.player.game.addOcean(this.player, space);
        this.cb(space);
        return undefined;
      });
  }

  private getTitle(type: PlacementType) {
    switch (type) {
    case 'ocean': return 'Select space for ocean tile';
    case 'land': return 'Select a land space to place an ocean tile';
    // case '': return 'Select space reserved for ocean to place greenery tile';
    default: throw new Error('unhandled type; ' + type);
    }
  }
}
