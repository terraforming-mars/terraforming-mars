import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {BuildColony} from '../../deferredActions/BuildColony';
import {Resources} from '../../Resources';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {ColonyName} from '../../colonies/ColonyName';

export class VitalColony extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.VITAL_COLONY;

    public play(player: Player, game: Game) {
      const coloniesBeforeBuilding: ColonyName[] = [];
      game.colonies.forEach((colony) => {
        if (colony.colonies.includes(player.id)) {
          coloniesBeforeBuilding.push(colony.name);
        }
      });

      game.defer(new BuildColony(player, game, false, 'Select where to build colony'));
      game.defer(new DeferredAction(player, () => {
        game.colonies.forEach((colony) => {
          if (colony.colonies.includes(player.id) && !coloniesBeforeBuilding.includes(colony.name)) {
            colony.giveBonus(player, game, colony.buildType, colony.buildQuantity[colony.colonies.length - 1], colony.buildResource);
          }
        });

        return undefined;
      }));

      player.setResource(Resources.MEGACREDITS, -5);
      return undefined;
    }
}

