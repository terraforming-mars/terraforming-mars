import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';

export class UNMIContractor extends PreludeCard implements IProjectCard {
    public tags = [Tags.EARTH];
    public name = CardName.UNMI_CONTRACTOR;

    public play(player: Player, game: Game) {
      player.increaseTerraformRatingSteps(3, game);
      game.defer(new DrawCards(player, game, 1));
      return undefined;
    }
}
