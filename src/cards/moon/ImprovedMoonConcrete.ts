import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {Player} from '../../Player';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {MoonCard} from './MoonCard';

export class ImprovedMoonConcrete extends MoonCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.IMPROVED_MOON_CONCRETE,
      cardType: CardType.AUTOMATED,
      cost: 12,

      metadata: {
        description: 'Spend 2 steel. Raise the Mining Rate 1 step.',
        cardNumber: 'M37',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you build a mine on the Moon, you spend 1 steel less.', (eb) => {
            eb.moonMine().startEffect.minus().steel(1);
          }).br;
          b.minus().steel(2).moonMiningRate();
        }),
      },
    }, {
      reserveUnits: Units.of({steel: 2}),
    });
  }

  public play(player: Player) {
    super.play(player);
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
