import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
//import {Size} from '../../../common/cards/render/Size';
import {ActionCard} from '../ActionCard';
import {all} from '../Options';


export class AcuteRadiationSickness extends ActionCard {
  constructor() {
    super({
      name: CardName.ACUTE_RADIATION_SICKNESS,
      type: CardType.ACTIVE,
      tags: [Tag.RADIATION],
      cost: 3,
      resourceType: CardResource.RADIATION,
      victoryPoints: -1,

      action: {
        or: {
          behaviors: [
            {
              addResourcesToAnyCard: {count: 1, type: CardResource.RADIATION},
              title: 'Add 1 radiation to any card.',
            },
            {
              spend: {resourcesHere: 1},
              removeAnyPlants: 1,
              title: 'Remove 1 radiation here to remove 1 plant from any player.',
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'N17',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 radiation to any card.', (be) => {
            be.startAction.radiations(1).asterix();
          }).br.or().br;
          b.action('Remove 1 radiation from this card to remove 1 plant from any player.', (be) => {
            be.radiations(1).startAction.plants(-1, {all});
          }).br;
        }),
      },
    });
  }
}
