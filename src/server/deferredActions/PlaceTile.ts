import {IPlayer} from '@/server/IPlayer';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {Space} from '@/server/boards/Space';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';
import {PlacementType} from '@/server/boards/PlacementType';
import {Tile} from '@/server/Tile';
import {AdjacencyBonus} from '@/server/ares/AdjacencyBonus';
import {Message} from '@/common/logs/Message';

export class PlaceTile extends DeferredAction<Space> {
  constructor(
    player: IPlayer,
    private options: {
      tile: Tile,
      on: PlacementType | (() => ReadonlyArray<Space>),
      title: string | Message,
      adjacencyBonus?: AdjacencyBonus;
    }) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const game = this.player.game;
    const on = this.options.on;
    const availableSpaces =
      typeof on === 'string' ?
        game.board.getAvailableSpacesForType(this.player, on) :
        on();
    const title = this.options?.title;

    return new SelectSpace(title, availableSpaces)
      .andThen((space: Space) => {
        const tile: Tile = {...this.options.tile};
        if (this.options.on === 'upgradeable-ocean') {
          tile.covers = space.tile;
        }
        game.addTile(this.player, space, tile);
        space.adjacency = this.options.adjacencyBonus;
        this.cb(space);
        return undefined;
      });
  }
}
