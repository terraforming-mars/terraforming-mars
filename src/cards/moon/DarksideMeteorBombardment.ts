import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class DarksideMeteorBombardment extends Card {
  constructor() {
    super({
      name: CardName.DARKSIDE_METEOR_BOMBARDMENT,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE],
      cost: 20,
      tr: {moonMining: 2},

      metadata: {
        description: 'Gain 2 steel and 2 titanium. Raise the Mining Rate 2 steps.',
        cardNumber: 'M33',
        renderData: CardRenderer.builder((b) => {
          b.steel(2).titanium(2);
          b.br;
          b.moonMiningRate({amount: 2});
        }),
      },
    });
  }

  public play(player: Player) {
    player.steel += 2;
    player.titanium += 2;
    MoonExpansion.raiseMiningRate(player, 2);
    return undefined;
  }
}
