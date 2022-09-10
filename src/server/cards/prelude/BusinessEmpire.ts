import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class BusinessEmpire extends PreludeCard {
  constructor() {
    super({
      name: CardName.BUSINESS_EMPIRE,
      tags: [Tag.EARTH],

      behavior: {
        production: {megacredits: 6},
      },
      startingMegacredits: -6,

      metadata: {
        cardNumber: 'P06',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(6)).br;
          b.megacredits(-6);
        }),
        description: 'Increase your M€ production 6 steps. Pay 6 M€.',
      },
    });
  }
  public override bespokeCanPlay(player: Player) {
    if (player.isCorporation(CardName.MANUTECH)) return true;
    return player.canAfford(6);
  }
  public override bespokePlay(player: Player) {
    player.game.defer(new SelectPaymentDeferred(player, 6));
    return undefined;
  }
}

