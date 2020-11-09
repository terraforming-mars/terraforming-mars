import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';

export class EarlySettlement extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL, Tags.CITY];
    public name = CardName.EARLY_SETTLEMENT;
    public play(player: Player, game: Game) {
      player.addProduction(Resources.PLANTS);
      game.defer(new PlaceCityTile(player, game));
      return undefined;
    }
}

