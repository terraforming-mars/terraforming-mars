import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
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
        description: 'Gain 2 MC [SOLO: Gain 10 MC]. Immediately trade with all active colonies. You may increase the Colony Tile track 1 step before each of these trades.',
      },
    });
  }

  public play(player: Player, game: Game) {
    game.defer(new DeferredAction(
      player,
      () => {
        const openColonies = game.colonies.filter((colony) => colony.isActive);
        openColonies.forEach((colony) => {
          colony.trade(player, game, 1, false);
        });
        return undefined;
      },
    ));

    if (game.isSoloMode()) {
      player.megaCredits += 10;
    } else {
      player.megaCredits += 2;
    }

    return undefined;
  }
}
