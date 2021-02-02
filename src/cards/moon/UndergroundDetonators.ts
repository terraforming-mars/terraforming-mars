import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class UndergroundDetonators extends Card {
  constructor() {
    super({
      name: CardName.UNDERGROUND_DETONATORS,
      tags: [Tags.EVENT],
      cardType: CardType.EVENT,
      cost: 9,

      metadata: {
        description: 'Gain 1 steel and 1 titanium. Raise Mining Rate 1 step.',
        cardNumber: 'M34',
        renderData: CardRenderer.builder((b) => {
          b.steel(1).titanium(1);
          b.br;
          b.moonMiningRate(1);
        }),
      },
    });
  };

  public canPlay(): boolean {
    return true;
  }

  public play(player: Player) {
    player.steel += 1;
    player.titanium += 1;
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
