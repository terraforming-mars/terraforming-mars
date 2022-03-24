import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class TitaniumMine extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TITANIUM_MINE,
      tags: [Tags.BUILDING],
      cost: 7,
      productionBox: Units.of({titanium: 1}),

      metadata: {
        cardNumber: '144',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1));
        }),
        description: 'Increase your titanium production 1 step.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 1);
    return undefined;
  }
}
