import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class RadSuits extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RAD_SUITS,
      cost: 6,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: 1},
      },

      requirements: CardRequirements.builder((b) => b.cities(2, {all})),
      metadata: {
        cardNumber: '186',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Requires two cities in play. Increase your M€ production 1 step.',
      },
    });
  }
}
