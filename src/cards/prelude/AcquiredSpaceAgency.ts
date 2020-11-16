import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';

export class AcquiredSpaceAgency extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.ACQUIRED_SPACE_AGENCY;
    public play(player: Player, game: Game) {
      game.defer(new DrawCards(player, game, 2, Tags.SPACE));
      player.titanium += 6;
      return undefined;
    };
}

