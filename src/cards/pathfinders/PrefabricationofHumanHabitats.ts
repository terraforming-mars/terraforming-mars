import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../common/Resources';
import {CardRequirements} from '../CardRequirements';
import {Tags} from '../../common/cards/Tags';
import {Size} from '../../common/cards/render/Size';
import {played} from '../Options';

export class PrefabricationofHumanHabitats extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PREFABRICATION_OF_HUMAN_HABITATS,
      cost: 8,
      tags: [Tags.BUILDING, Tags.CITY],

      requirements: CardRequirements.builder((b) => b.production(Resources.STEEL)),
      cardDiscount: {tag: Tags.CITY, amount: 2},

      metadata: {
        cardNumber: 'Pf02',
        renderData: CardRenderer.builder((b) => {
          b.effect('Cards with a city tag cost 2M€ less.', (eb) => {
            eb.city({size: Size.MEDIUM, played}).startEffect.megacredits(-2);
          });
          b.br;
          b.effect('The City standard project costs 2M€ less. STEEL MAY BE USED as if you were playing a Building card.', (eb) => {
            eb.city().asterix().startEffect.megacredits(23).openBrackets.steel(1).closeBrackets;
          });
        }),
        description: 'Requires that you have steel production.',
      },
    });
  }

  public play() {
    return undefined;
  }
}

