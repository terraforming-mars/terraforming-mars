import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {ColonyName} from '../../colonies/ColonyName';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MAX_COLONY_TRACK_POSITION} from '../../constants';
import {GiveTradeBonus} from '../../deferredActions/GiveTradeBonus';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class TradeAdvance extends PreludeCard implements IProjectCard {
    public tags = [Tags.EARTH];
    public name = CardName.TRADE_ADVANCE;

    public play(player: Player, game: Game) {
      const openColonies = game.colonies.filter((colony) => colony.isActive);

      openColonies.forEach((colony) => {
        if (colony.name === ColonyName.EUROPA || colony.name === ColonyName.HYGIEA) {
          const title = 'Increase ' + colony.name + ' colony track before trade';
          game.defer(new DeferredAction(
              player,
              () => new OrOptions(
                  new SelectOption(title, 'Confirm', () => {
                    colony.increaseTrack();
                    colony.trade(player, game, false);
                    colony.decreaseTrack(MAX_COLONY_TRACK_POSITION);
                    return undefined;
                  }),
                  new SelectOption('Do nothing', 'Confirm', () => {
                    colony.trade(player, game, false);
                    colony.decreaseTrack(MAX_COLONY_TRACK_POSITION);
                    return undefined;
                  }),
              ),
          ));
        } else {
          colony.increaseTrack();
          colony.trade(player, game, false);
          colony.decreaseTrack(MAX_COLONY_TRACK_POSITION);
        }

        if (colony.colonies.length > 0) {
          game.defer(new GiveTradeBonus(player, game, colony));
        }
      });

      if (game.isSoloMode()) {
        player.megaCredits += 10;
      } else {
        player.megaCredits += 2;
      }

      return undefined;
    }
}

