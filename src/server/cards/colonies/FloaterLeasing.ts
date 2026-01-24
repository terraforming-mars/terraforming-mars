import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {CardResource} from '../../../common/CardResource';

export class FloaterLeasing extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 3,
      name: CardName.FLOATER_LEASING,
      type: CardType.AUTOMATED,

      behavior: {
        production: {megacredits: {floaters: {}, per: 3}},
      },

      metadata: {
        cardNumber: 'C10',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().resource(CardResource.FLOATER, {amount: 3, digit});
        }),
        description: 'Increase your M€ production 1 step PER 3 floaters you have.',
      },
    });
  }
}
