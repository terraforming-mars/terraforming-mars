import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class TradeAdvance extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.TRADE_ADVANCE,
      tags: [Tag.EARTH],
      behavior: {
        stock: {megacredits: 2},
      },

      metadata: {
        cardNumber: 'Y05',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(2).text('[ solo').colon().megacredits(10).text(']').br;
          b.text('Trade all colonies with').br;
          b.trade().colon().text('+1');
        }),
        description: 'Gain 2 M€ [SOLO: Gain 10 M€]. Immediately trade with all active colonies. You may increase the Colony Tile track 1 step before each of these trades.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.defer(() => {
      const activeColonies = player.game.colonies.filter((colony) => colony.isActive);
      activeColonies.forEach((colony) => {
        colony.trade(player, {usesTradeFleet: false}, 1);
      });
      return undefined;
    });

    if (player.game.isSoloMode()) {
      player.megaCredits += 8;
    }

    return undefined;
  }
}
