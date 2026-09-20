import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {IActionCard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class DarksideIncubationPlant extends ActionCard implements IActionCard, IProjectCard {
  constructor() {
    super({
      name: CardName.DARKSIDE_INCUBATION_PLANT,
      type: CardType.ACTIVE,
      tags: [Tag.MICROBE, Tag.MOON],
      cost: 11,

      resourceType: CardResource.MICROBE,
      victoryPoints: {resourcesHere: {}, per: 2},
      reserveUnits: {titanium: 1},

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {title: 'Spend 2 microbes to raise the habitat rate 1 step.', spend: {resourcesHere: 2}, moon: {habitatRate: 1}},
            {title: 'Add 1 microbe to this card', addResources: 1},
          ],
        },
      },

      metadata: {
        description: {
          text: 'Spend 1 titanium. 1 VP for every 2 microbes here.',
          align: 'left',
        },
        cardNumber: 'M45',
        renderData: CardRenderer.builder((b) => {
          b.arrow().resource(CardResource.MICROBE).nbsp.or().br;
          b.resource(CardResource.MICROBE, 2).arrow().moonHabitatRate().br;

          b.plainText('Action: Add 1 microbe here, or spend 2 microbes to raise the habitat rate 1 step.', /* parens */ true);
          b.br;
          b.minus().titanium(1);
        }),
      },
    });
  }
}
