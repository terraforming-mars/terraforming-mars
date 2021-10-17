import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {BuildColony} from '../../deferredActions/BuildColony';
import {Card} from '../Card';

export class LTFHeadquarters extends Card {
  constructor() {
    super({
      name: CardName.LTF_HEADQUARTERS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SPACE],
      cost: 31,
      tr: {moonColony: 1},

      metadata: {
        description: 'Raise the Colony Rate 1 step. Place a colony. Gain 1 trade fleet.',
        cardNumber: 'M79',
        renderData: CardRenderer.builder((b) => {
          b.moonColonyRate().colonies(1).tradeFleet();
        }),
      },
    });
  };

  public play(player: Player) {
    MoonExpansion.raiseColonyRate(player);
    player.game.defer(new BuildColony(player, false));
    player.increaseFleetSize();
    return undefined;
  }

  public onDiscard(player: Player) {
    player.decreaseFleetSize();
  }
}
