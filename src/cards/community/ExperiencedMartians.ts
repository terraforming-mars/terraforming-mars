import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';

export class ExperiencedMartians extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL];
    public name = CardName.EXPERIENCED_MARTIANS;

    public play(player: Player, game: Game) {
      player.addProduction(Resources.HEAT);
      player.addProduction(Resources.PLANTS);

      game.defer(new SendDelegateToArea(player, game, 'Select where to send 2 delegates', 2, undefined, undefined, false));

      return undefined;
    }
}

