import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {TileType} from '../../../common/TileType';
import { SpaceBonus } from '../../../common/boards/SpaceBonus';

export class EvacuationZone extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.EVACUATION_ZONE,
      tags: [Tag.RADIATION],
      cost: 20,

      action: {
        spend: {energy: 1},
        addResourcesToAnyCard: {count: 1, type: CardResource.RADIATION}
      },

      behavior: {
        tile: {
          type: TileType.EVACUATION_ZONE,
          on: 'upgradeable-greenery',
          title: 'Select space for Evacuation Zone',
          adjacencyBonus: {bonus: [SpaceBonus.MICROBE], count: -1, bonus2: [SpaceBonus.PLANT], count2: -1},
        }
      },

      metadata: {
        cardNumber: 'N2',
        description: {
          text: 'Requires any greenery ON MARS. Place Evacuation Zone tile ON TOP of any greenery tile and mark it with player marker. That players owns this tile. Adjacency removes 1 mirobe and 1 plant.',
          align: 'center',
        },
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 energy to 1 radiation to ANY card.', (eb) => {
            eb.energy(1).startAction.radiations(1).asterix();
          }).br;
            b.tile(TileType.EVACUATION_ZONE, false, true).asterix();
        }),
      },
    });
  }
}
