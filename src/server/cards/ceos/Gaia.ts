import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {SpaceType} from '../../../common/boards/SpaceType';

import {AresHandler} from '../../ares/AresHandler';

export class Gaia extends CeoCard {
  constructor() {
    super({
      name: CardName.GAIA,
      metadata: {
        cardNumber: 'L32',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().colon().adjacencyBonus().asterix();
          b.br;
        }),
        description: 'Once per game, gain the Ares adjacency bonuses of all tiles placed on Mars.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    this.isDisabled = true;
    const board = player.game.board;
    // For every tile placed on the board, grant all the adjacency bonuses for that tile.
    // Owners and types of the tiles do not matter.  All the space needs a tile, including Ocean Tiles.
    const tilesOnMars = board.spaces.filter((space) =>
      space.tile?.tileType !== undefined && space.spaceType !== SpaceType.COLONY,
    );
    tilesOnMars.forEach((space) => {
      AresHandler.ifAres(player.game, (aresData) => {
        AresHandler.earnAdjacencyBonuses(aresData, player, space, true);
      });
    });
    return undefined;
  }
}
