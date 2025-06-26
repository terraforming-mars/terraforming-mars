import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '../../IPlayer';
import {IStandardProjectCard} from '../IStandardProjectCard';

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
            eb.tag(Tag.CITY, {size: Size.MEDIUM}).startEffect.megacredits(-2);
          });
          b.br;
          b.effect('The CITY STANDARD PROJECT costs 2M€ less. STEEL MAY BE USED as if you were playing a building card.', (eb) => {
            eb.city().asterix().startEffect.megacredits(23).super((b) => b.steel(1));
          });
        }),
        description: 'Requires that you have steel production.',
      },
    });
  }

  public getStandardProjectDiscount(_player: IPlayer, card: IStandardProjectCard): number {
    if (card.name === CardName.CITY_STANDARD_PROJECT) {
      return 2;
    }
    return 0;
  }
}

