import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class AIControlledMineNetwork extends Card {
  constructor() {
    super({
      name: CardName.AI_CONTROLLED_MINE_NETWORK,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SCIENCE],
      cost: 6,
      tr: {moonLogistics: 1},

      requirements: CardRequirements.builder((b) => b.logisticRate(2)),
      metadata: {
        description: 'Requires Logistic Rate to be 2 or higher. Raise the Logistic Rate 1 step',
        cardNumber: 'M32',
        renderData: CardRenderer.builder((b) => {
          b.moonLogisticsRate();
        }),
      },
    });
  };

  public play(player: Player) {
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }
}
