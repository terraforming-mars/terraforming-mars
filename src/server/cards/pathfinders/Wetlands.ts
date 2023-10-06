import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Space} from '../../boards/Space';
import {CanAffordOptions, IPlayer} from '../../IPlayer';
import {TileType} from '../../../common/TileType';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Board} from '../../boards/Board';
import {Size} from '../../../common/cards/render/Size';

export class Wetlands extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.WETLANDS,
      tags: [Tag.PLANT, Tag.MARS],
      cost: 20,
      tr: {oxygen: 1, tr: 1},
      requirements: {oceans: 2},
      reserveUnits: {plants: 4},
      victoryPoints: 1,

      metadata: {
        cardNumber: 'Pf03',
        renderData: CardRenderer.builder((b) => {
          b.minus().plants(4).br;
          b.tile(TileType.WETLANDS, false, false).asterix();
          b.oxygen(1).tr(1);
          b.br;
          b.text('(Requires 2 ocean tiles. Lose 4 plants. Place this tile on an UNRESERVED SPACE ' +
            'ADJACENT TO AT LEAST 2 OCEANS. Raise oxygen 1 step. Gain 1 TR.)', Size.TINY, false, false);
          b.br;
          b.text('(Effect: Wetlands counts as a greenery tile and an ocean tile, except it can\'t be covered and is not one of the 9 oceans required to end the game.)', Size.TINY, false, false);
        }),
      },
    });
  }

  public availableSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions) {
    const board = player.game.board;
    const adjacentOceans: (space: Space) => number = (space) => {
      const adjacentSpaces = board.getAdjacentSpaces(space);
      return adjacentSpaces.filter(Board.isOceanSpace).length;
    };

    const redCity = board.getSpaceByTileCard(CardName.RED_CITY);
    const spacesNextToRedCity = redCity ?
      board.getAdjacentSpaces(redCity) :
      [];
    return board.getAvailableSpacesOnLand(player, canAffordOptions)
      .filter((space) => adjacentOceans(space) >= 2)
      .filter((space) => !spacesNextToRedCity.includes(space));
  }

  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions) {
    if (!player.stock.has(this.reserveUnits)) {
      return false;
    }
    return this.availableSpaces(player, canAffordOptions).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.stock.deductUnits(this.reserveUnits);

    return new SelectSpace(
      'Select space for Wetlands',
      this.availableSpaces(player))
      .andThen((space) => {
        const tile = {
          tileType: TileType.WETLANDS,
          card: this.name,
          covers: space.tile,
        };
        player.game.addTile(player, space, tile);
        player.game.increaseOxygenLevel(player, 1);
        return undefined;
      });
  }
}
