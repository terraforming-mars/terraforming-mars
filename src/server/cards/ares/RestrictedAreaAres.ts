import {CardName} from '../../../common/cards/CardName';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {RestrictedArea} from '../base/RestrictedArea';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';

export class RestrictedAreaAres extends RestrictedArea {
  constructor() {
    super(
      CardName.RESTRICTED_AREA_ARES,
      {bonus: [SpaceBonus.DRAW_CARD]},
      {
        cardNumber: 'A24',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 M€ to draw a card.', (eb) => {
            eb.megacredits(2).startAction.cards(1);
          }).br;
          b.tile(TileType.RESTRICTED_AREA, false, true);
        }),
        description: 'Place this tile which grants an ADJACENCY BONUS of 1 card.',
      });
  }
}
