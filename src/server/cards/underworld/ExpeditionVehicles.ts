import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {isHazardTileType} from '../../../common/AresTileType';
import {BoardType} from '../../boards/BoardType';
import {MoonExpansion} from '../../moon/MoonExpansion';

export class ExpeditionVehicles extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.EXPEDITION_VEHICLES,
      type: CardType.ACTIVE,
      cost: 10,
      tags: [Tag.SCIENCE],

      victoryPoints: 1,

      metadata: {
        cardNumber: 'U79',
        renderData: CardRenderer.builder((b) => {
          b.effect(
            'After you place a tile (on Mars or in space) that has no adjacent tiles, draw a card.',
            (eb) => eb.emptyTile().asterix().startEffect.cards(1)).br;
        }),
      },
    });
  }

  onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    if (cardOwner === activePlayer) {
      const game = activePlayer.game;
      const board = boardType === BoardType.MARS ? game.board : MoonExpansion.moonData(game).moon;
      const adjacentSpacesWithTiles = board.getAdjacentSpaces(space)
        .filter((space) => {
          return space.tile !== undefined && !isHazardTileType(space.tile.tileType);
        });
      if (adjacentSpacesWithTiles.length === 0) {
        cardOwner.drawCard(1);
      }
    }
  }
}
