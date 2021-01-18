import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Units} from '../../Units';
import {Player} from '../../Player';
import {MoonExpansion} from '../../moon/MoonExpansion';

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

  public reserveUnits = Units.of({steel: 2});

  public canPlay(): boolean {
    return true;
  }

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
