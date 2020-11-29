import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {LogHelper} from '../../components/LogHelper';

export class MartianRails implements IActionCard, IProjectCard {
    public cost = 13;
    public tags = [Tags.STEEL];
    public name = CardName.MARTIAN_RAILS;
    public cardType = CardType.ACTIVE;

    public play(_player: Player, _game: Game) {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.energy >= 1;
    }
    public action(player: Player, game: Game) {
      const gainedMC = game.getCitiesInPlayOnMars();
      player.energy--;
      player.megaCredits += gainedMC;
      LogHelper.logGainStandardResource(game, player, Resources.MEGACREDITS, gainedMC);

      return undefined;
    }
}
