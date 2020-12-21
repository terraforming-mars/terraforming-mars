import {CardName} from '../../CardName';
import {SpaceBonus} from '../../SpaceBonus';
import {RestrictedArea} from '../base/RestrictedArea';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class RestrictedAreaAres extends RestrictedArea {
  public name = CardName.RESTRICTED_AREA_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.DRAW_CARD]};

  public metadata: CardMetadata = {
    cardNumber: 'A24',
    renderData: CardRenderer.builder((b) => {
      b.effectBox((eb) => {
        eb.megacredits(2).startAction.cards(1);
        eb.description('Action: Spend 2 MC to draw a card.');
      }).br;
      b.tile(TileType.RESTRICTED_AREA, false, true);
    }),
    description: 'Place this tile which grants an ADJACENCY BONUS of 1 card.',
  }
}
