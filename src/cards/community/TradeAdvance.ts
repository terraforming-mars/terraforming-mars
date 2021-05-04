import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';

export class TradeAdvance extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.TRADE_ADVANCE,
      tags: [Tags.EARTH],

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

  public play(player: Player) {
    player.game.defer(new DeferredAction(
      player,
      () => {
        const openColonies = player.game.colonies.filter((colony) => colony.isActive);
        openColonies.forEach((colony) => {
          colony.trade(player, 1, false);
        });
        return undefined;
      },
    ));

    if (player.game.isSoloMode()) {
      player.megaCredits += 10;
    } else {
      player.megaCredits += 2;
    }

    return undefined;
  }
}
