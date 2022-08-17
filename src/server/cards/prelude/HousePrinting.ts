import {Tags} from '../../../common/cards/Tags';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';
import {IProjectCard} from '../IProjectCard';

export class HousePrinting extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.HOUSE_PRINTING,
      tags: [Tags.BUILDING],
      cost: 10,
      productionBox: Units.of({steel: 1}),
      victoryPoints: 1,

      metadata: {
        cardNumber: 'P36',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(1));
        }),
        description: 'Increase your steel production 1 step.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.STEEL, 1);
    return undefined;
  }
}
