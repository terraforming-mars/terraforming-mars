import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class UndergroundDetonators extends Card {
  constructor() {
    super({
      name: CardName.UNDERGROUND_DETONATORS,
      cardType: CardType.EVENT,
      cost: 9,
      tr: {moonMining: 1},

      metadata: {
        description: 'Gain 1 steel and 1 titanium. Raise the Mining Rate 1 step.',
        cardNumber: 'M34',
        renderData: CardRenderer.builder((b) => {
          b.steel(1).titanium(1);
          b.br;
          b.moonMiningRate();
        }),
      },
    });
  }

  public play(player: Player) {
    player.steel += 1;
    player.titanium += 1;
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
