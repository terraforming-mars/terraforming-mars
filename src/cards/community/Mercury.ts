import {Colony, IColony} from '../../colonies/Colony';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Game} from '../../Game';
import {ColonyName} from '../../colonies/ColonyName';
import {LogHelper} from '../../components/LogHelper';
import {Resources} from '../../Resources';
import {SelectColony} from '../../inputs/SelectColony';
import {ColonyModel} from '../../models/ColonyModel';
import {IncreaseColonyTrack} from '../../deferredActions/IncreaseColonyTrack';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class Mercury extends Colony implements IColony {
    public name = ColonyName.MERCURY;
    public description: string = 'Production';

    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
      if (player.colonyTradeOffset && usesTradeFleet) {
        game.defer(new IncreaseColonyTrack(
            player,
            game,
            this,
            () => this.handleTrade(player, game, usesTradeFleet),
        ));
      } else {
        this.handleTrade(player, game, usesTradeFleet);
      }
    }

    private handleTrade(player: Player, game: Game, usesTradeFleet: boolean) {
      if (this.trackPosition < 3) {
        player.addProduction(Resources.HEAT);
        LogHelper.logGainProduction(game, player, Resources.HEAT);
      } else if (this.trackPosition < 5) {
        player.addProduction(Resources.STEEL);
        LogHelper.logGainProduction(game, player, Resources.STEEL);
      } else {
        player.addProduction(Resources.TITANIUM);
        LogHelper.logGainProduction(game, player, Resources.TITANIUM);
      }

      if (usesTradeFleet) {
        this.afterTrade(this, player, game);
      }
    }

    public onColonyPlaced(player: Player, game: Game): undefined {
      super.addColony(this, player, game);

      const openColonies = game.colonies.filter((colony) => colony.isActive);

      if (openColonies.length > 0) {
        const coloniesModel: Array<ColonyModel> = game.getColoniesModel(openColonies);

        game.defer(new DeferredAction(
            player,
            () => new SelectColony('Select colony to gain trade income from', 'Select', coloniesModel, (colonyName: ColonyName) => {
              openColonies.forEach((colony) => {
                if (colony.name === colonyName) {
                  game.log(
                      '${0} gained ${1} trade bonus',
                      (b) => b.player(player).colony(colony),
                  );
                  colony.trade(player, game, false);
                  return undefined;
                }

                return undefined;
              });

              return undefined;
            }),
        ));
      }

      return undefined;
    }

    public giveTradeBonus(player: Player): undefined | PlayerInput {
      player.megaCredits += 2;
      return undefined;
    }
}
