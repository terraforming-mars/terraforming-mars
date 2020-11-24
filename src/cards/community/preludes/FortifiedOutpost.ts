import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';
import {Game} from '../../../Game';
import {Tags} from '../../Tags';
import {PlaceCityTile} from '../../../deferredActions/PlaceCityTile';
import {SelectHowToPayDeferred} from '../../../deferredActions/SelectHowToPayDeferred';
import {PlaceGreeneryTile} from '../../../deferredActions/PlaceGreeneryTile';

export class FortifiedOutpost extends PreludeCard implements IProjectCard {
    public tags = [Tags.CITY];
    public name = CardName.FORTIFIED_OUTPOST;

    public canPlay(player: Player) {
      return player.canAfford(10);
    }

    public play(player: Player, game: Game) {
      game.defer(new PlaceCityTile(player, game));
      game.defer(new PlaceGreeneryTile(player, game));
      game.defer(new SelectHowToPayDeferred(player, 10, false, false));
      return undefined;
    }
}

