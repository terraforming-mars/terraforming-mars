import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
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

      requirements: CardRequirements.builder((b) => b.production(Resources.TITANIUM, 2)),
      metadata: {
        description: 'Requires that you have 2 titanium production. ' +
        'Increase your MC production 1 step. Raise Logistic Rate 1 step.',
        cardNumber: 'M35',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1));
          b.br;
          b.moonLogisticsRate();
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.TITANIUM) >= 2;
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1, player.game);
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }
}
