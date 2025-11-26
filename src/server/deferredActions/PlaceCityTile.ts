import {IPlayer} from '@/server/IPlayer';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {Space} from '@/server/boards/Space';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';
import {PlacementType} from '@/server/boards/PlacementType';
import {Message} from '@/common/logs/Message';

export class PlaceCityTile extends DeferredAction<Space | undefined> {
  constructor(
    player: IPlayer,
    private options?: {
      on?: PlacementType,
      title?: string | Message,
      spaces?: ReadonlyArray<Space>,
    }) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const type = this.options?.on || 'city';
    const spaces = this.options?.spaces || this.player.game.board.getAvailableSpacesForType(this.player, type);
    const title = this.options?.title ?? this.getTitle(type);

    if (spaces.length === 0) {
      this.cb(undefined);
      return undefined;
    }
    return new SelectSpace(title, spaces)
      .andThen((space) => {
        this.player.game.addCity(this.player, space);
        this.cb(space);
        return undefined;
      });
  }

  private getTitle(type: PlacementType) {
    switch (type) {
    case 'city': return 'Select space for city tile';
    case 'isolated': return 'Select place next to no other tile for city';
    // case '': return 'Select space reserved for ocean to place greenery tile';
    default: throw new Error('unhandled type; ' + type);
    }
  }
}
