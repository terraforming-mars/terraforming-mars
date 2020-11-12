import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';
import {PlaceGreeneryTile} from '../../deferredActions/PlaceGreeneryTile';

export class ExperimentalForest extends PreludeCard implements IProjectCard {
    public tags = [Tags.PLANT];
    public name = CardName.EXPERIMENTAL_FOREST

    public play(player: Player, game: Game) {
      game.defer(new DrawCards(player, game, 2, Tags.PLANT));
      game.defer(new PlaceGreeneryTile(player, game));
      return undefined;
    }
}

