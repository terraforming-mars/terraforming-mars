import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';
import {PlacementType} from '../boards/PlacementType';
import {Tile} from '../Tile';
import {AdjacencyBonus} from '../ares/AdjacencyBonus';

export class PlaceTile extends DeferredAction {
  constructor(
    player: Player,
    private options: {
      tile: Tile,
      on: PlacementType,
      title?: string,
      adjacencyBonus?: AdjacencyBonus;
    }) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const game = this.player.game;
    const on = this.options.on;
    const availableSpaces = game.board.getAvailableSpacesForType(this.player, on);
    const title = this.options?.title ?? this.getTitle(on);

    return new SelectSpace(
      title,
      availableSpaces,
      (space: ISpace) => {
        const tile: Tile = {...this.options.tile};
        if (this.options.on === 'upgradeable-ocean') {
          tile.covers = space.tile;
        }
        game.addTile(this.player, space, tile);
        space.adjacency = this.options.adjacencyBonus;
        return undefined;
      },
    );
  }

  private getTitle(type: PlacementType) {
    switch (type) {
    case 'ocean': return 'Select an ocean space for special tile';
    case 'isolated': return 'Select space for special tile next to no other tile';
    default: return 'Select space for special tile';
    }
  }
}
