import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class Algae implements IProjectCard {
    public cost = 10;
    public tags = [Tags.PLANT];
    public name = CardName.ALGAE;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.board.getOceansOnBoard() >= 5 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
      player.plants++;
      player.addProduction(Resources.PLANTS, 2);
      return undefined;
    }
}
