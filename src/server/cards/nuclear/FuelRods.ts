import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Size} from '../../../common/cards/render/Size';
import {CardRequirements} from '../requirements/CardRequirements';

export class FuelRods extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.FUEL_RODS,
      tags: [Tag.RADIATION, Tag.POWER],
      cost: 17,
      requirements: CardRequirements.builder((b) => b.temperature(-18)),

      action: {
        or: {
          behaviors: [{
            title: 'Gain 1 heat and add 1 radiation to ANOTHER CARD.',
            stock: {heat: 1},
            addResourcesToAnyCard: {count: 1, type: CardResource.RADIATION}
          },
          {
            spend: {heat: 1},
            title: 'Spend 1 heat to gain 3 M€.',
            stock: {megacredits: 3}
          }],
        },
      },
      behavior: {
        production: {energy:1}
      },

      metadata: {
        cardNumber: 'N07',
        description: {
          text: 'Requires -18 C or warmer. Increase your energy production 1 step.',
          align: 'center',
        },
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 heat and add 1 radiation to ANOTHER card.', (be) => {
            be.empty().startAction.heat(1).radiations(1).asterix();
          }).br;
          b.or(Size.SMALL).br;
          b.action('Remove 1 heat to gain 3 M€.', (be) => {
            be.heat(1).startAction.megacredits(3);
          });
        }),
      },
    });
  }

  // KEEP THIS
  // private log(player: Player, resource: Resources) {
  //   player.game.log('${0} spent 1 ${1} to gain 7 M€', (b) => b.player(player).string(resource));
  // }
}
