import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class TradeAdvance extends PreludeCard implements IProjectCard {
    public tags = [Tags.EARTH];
    public name = CardName.TRADE_ADVANCE;

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
