import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class ImprovedMoonConcrete extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.IMPROVED_MOON_CONCRETE,
      cardType: CardType.AUTOMATED,
      cost: 12,

      metadata: {
        description: 'Effect: When you build a mine on the Moon, you spend 1 steel less. / Spend 2 steel. Raise Mining Rate 1 step.',
        cardNumber: 'M37',
        renderData: CardRenderer.builder((_b) => {}),
      },
    });
  }

  public canPlay(): boolean {
    return true;
  }

  public play() {
    return undefined;
  }
}
