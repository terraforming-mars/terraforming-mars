import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class LunarTradeFleet extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_TRADE_FLEET,
      cardType: CardType.AUTOMATED,
      tags: [Tag.MOON, Tag.SPACE],
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

  public override bespokePlay(player: Player) {
    player.production.add(Resources.MEGACREDITS, 1, {log: true});
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }
}
