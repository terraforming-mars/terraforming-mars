import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {BuildColony} from '../../deferredActions/BuildColony';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class LTFHeadquarters extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LTF_HEADQUARTERS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.SPACE],
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
  }

  public override bespokePlay(player: Player) {
    MoonExpansion.raiseColonyRate(player);
    player.game.defer(new BuildColony(player));
    player.colonies.increaseFleetSize();
    return undefined;
  }

  public onDiscard(player: Player) {
    player.colonies.decreaseFleetSize();
  }
}
