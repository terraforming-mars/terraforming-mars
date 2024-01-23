import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {SpaceType} from '../../../common/boards/SpaceType';

import {AresHandler} from '../../ares/AresHandler';
import {isHazardTileType} from '../../../common/AresTileType';

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
        description: 'Once per game, gain the Ares adjacency bonuses of all player-owned tiles on Mars.',
      },
    });
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const board = player.game.board;
    // For every tile placed on the board, grant all the adjacency bonuses for that tile.
    // We do not exclude Ocean tiles because of things like Ocean Cities.
    // We exclude all tiles that _do not_ have owners
    // We exlcude all hazard tiles. (Spaces with Hazard tiles can have players in weird edge cases, like with Land Claim)
    const tilesOnMars = board.spaces.filter((space) =>
      space.tile?.tileType !== undefined && space.player !== undefined && !isHazardTileType(space.tile.tileType) && space.spaceType !== SpaceType.COLONY,
    );
    tilesOnMars.forEach((space) => {
      AresHandler.ifAres(player.game, (aresData) => {
        AresHandler.earnAdjacencyBonuses(aresData, player, space, {incrementMilestone: false, giveAresTileOwnerBonus: false});
      });
    });
    return undefined;
  }
}
