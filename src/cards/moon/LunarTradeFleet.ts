import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class LunarTradeFleet extends Card {
  constructor() {
    super({
      name: CardName.LUNAR_TRADE_FLEET,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.SPACE],
      cost: 8,
      tr: {moonLogistics: 1},

      requirements: CardRequirements.builder((b) => b.production(Resources.TITANIUM, 2)),
      metadata: {
        description: 'Requires that you have 2 titanium production. ' +
        'Increase your M€ production 1 step. Raise the Logistic Rate 1 step.',
        cardNumber: 'M35',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1));
          b.br;
          b.moonLogisticsRate();
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1, {log: true});
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }
}
