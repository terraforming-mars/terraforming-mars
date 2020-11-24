import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';
import {Game} from '../../../Game';
import {BuildColony} from '../../../deferredActions/BuildColony';
import {Tags} from '../../Tags';
import {PlaceCityTile} from '../../../deferredActions/PlaceCityTile';
import {SelectHowToPayDeferred} from '../../../deferredActions/SelectHowToPayDeferred';

export class StrategicBasePlanning extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL];
    public name = CardName.STRATEGIC_BASE_PLANNING;

    public canPlay(player: Player) {
      return player.canAfford(6);
    }

    public play(player: Player, game: Game) {
      game.defer(new BuildColony(player, game, false, 'Select where to build colony'));
      game.defer(new PlaceCityTile(player, game));
      game.defer(new SelectHowToPayDeferred(player, 6, false, false));
      return undefined;
    }
}

