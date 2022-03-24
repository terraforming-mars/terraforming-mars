import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GiantSpaceMirror extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GIANT_SPACE_MIRROR,
      tags: [Tags.ENERGY, Tags.SPACE],
      cost: 17,

      metadata: {
        cardNumber: '083',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.energy(3))),
        description: 'Increase your energy production 3 steps.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 3);
    return undefined;
  }
}
