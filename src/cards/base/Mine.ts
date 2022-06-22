import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class Mine extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MINE,
      tags: [Tags.BUILDING],
      cost: 4,
      productionBox: Units.of({steel: 1}),

      metadata: {
        description: 'Increase your steel production 1 step.',
        cardNumber: '056',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.steel(1))),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.STEEL, 1);
    return undefined;
  }
}
