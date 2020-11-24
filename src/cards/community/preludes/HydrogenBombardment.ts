import {Tags} from '../../Tags';
import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';
import {Game} from '../../../Game';
import {Resources} from '../../../Resources';

export class HydrogenBombardment extends PreludeCard implements IProjectCard {
    public tags = [Tags.VENUS, Tags.SPACE];
    public name = CardName.HYDROGEN_BOMBARDMENT;

    public canPlay(player: Player) {
      return player.canAfford(3);
    }

    public play(player: Player, game: Game) {
      game.increaseVenusScaleLevel(player, 1);
      player.addProduction(Resources.TITANIUM);

      return undefined;
    }
}

