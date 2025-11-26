import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {ActionCard} from '@/server/cards/ActionCard';
import {CardType} from '@/common/cards/CardType';
import {TileType} from '@/common/TileType';
import {CardName} from '@/common/cards/CardName';
import {AdjacencyBonus} from '@/server/ares/AdjacencyBonus';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class RestrictedArea extends ActionCard implements IProjectCard {
  constructor(
    name = CardName.RESTRICTED_AREA,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '199',
      renderData: CardRenderer.builder((b) => {
        b.action('Spend 2 M€ to draw a card.', (eb) => {
          eb.megacredits(2).startAction.cards(1);
        }).br;
        b.tile(TileType.RESTRICTED_AREA, true);
      }),
      description: 'Place this tile.',
    }) {
    super({
      type: CardType.ACTIVE,
      name,
      tags: [Tag.SCIENCE],
      cost: 11,

      behavior: {
        tile: {
          type: TileType.RESTRICTED_AREA,
          on: 'land',
          adjacencyBonus: adjacencyBonus,
        },
      },

      action: {
        spend: {megacredits: 2},
        drawCard: 1,
      },

      metadata,
    });
  }
}
