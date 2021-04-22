import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

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
