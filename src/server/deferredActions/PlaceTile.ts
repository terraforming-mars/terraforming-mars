import {IPlayer} from '../IPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {Space} from '../boards/Space';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {PlacementType} from '../boards/PlacementType';
import {Tile} from '../Tile';
import {AdjacencyBonus} from '../ares/AdjacencyBonus';
import {Message} from '../../common/logs/Message';

export class PlaceTile extends DeferredAction {
  constructor(
    player: IPlayer,
    private options: {
      tile: Tile,
      on: PlacementType,
      title: string | Message,
      adjacencyBonus?: AdjacencyBonus;
    }) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const game = this.player.game;
    const on = this.options.on;
    const availableSpaces = game.board.getAvailableSpacesForType(this.player, on);
    const title = this.options?.title;

    return new SelectSpace(title, availableSpaces)
      .andThen((space: Space) => {
        const tile: Tile = {...this.options.tile};
        if (this.options.on === 'upgradeable-ocean') {
          tile.covers = space.tile;
        }
        game.addTile(this.player, space, tile);
        space.adjacency = this.options.adjacencyBonus;
        return undefined;
      });
  }
}
