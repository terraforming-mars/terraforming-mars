import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {Size} from '../../../common/cards/render/Size';
import {played} from '../Options';

export class PrefabricationofHumanHabitats extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PREFABRICATION_OF_HUMAN_HABITATS,
      cost: 8,
      tags: [Tag.BUILDING, Tag.CITY],

      requirements: {production: Resource.STEEL, count: 1},
      cardDiscount: {tag: Tag.CITY, amount: 2},

      metadata: {
        cardNumber: 'Pf02',
        renderData: CardRenderer.builder((b) => {
          b.effect('Cards with a city tag cost 2M€ less.', (eb) => {
            eb.city({size: Size.MEDIUM, played}).startEffect.megacredits(-2);
          });
          b.br;
          b.effect('The CITY STANDARD PROJECT costs 2M€ less. STEEL MAY BE USED as if you were playing a building card.', (eb) => {
            eb.city().asterix().startEffect.megacredits(23).openBrackets.steel(1).closeBrackets;
          });
        }),
        description: 'Requires that you have steel production.',
      },
    });
  }
}

