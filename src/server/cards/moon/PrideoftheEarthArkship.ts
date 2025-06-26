import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IActionCard} from '../ICard';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class PrideoftheEarthArkship extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.PRIDE_OF_THE_EARTH_ARKSHIP,
      type: CardType.ACTIVE,
      tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SPACE],
      cost: 22,

      resourceType: CardResource.SCIENCE,
      victoryPoints: {resourcesHere: {}},
      requirements: [{tag: Tag.SCIENCE}, {tag: Tag.SPACE, count: 2}],
      reserveUnits: {titanium: 2},

      action: {
        addResources: {tag: Tag.SCIENCE, per: 5},
      },

      metadata: {
        description: 'Requires 1 science and 2 space tags. Spend 2 titanium. 1 VP per science resource here.',
        cardNumber: 'M24',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 science resource here per every 5 science tags you have.', (eb) => {
            eb.empty().startAction.resource(CardResource.SCIENCE).slash().text('5').tag(Tag.SCIENCE);
          }).br;
          b.minus().titanium(2);
        }),
      },
    });
  }
}
