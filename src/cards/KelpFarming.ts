
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class KelpFarming implements IProjectCard {
    public cost = 17;
    public tags = [Tags.PLANT];
    public name = CardName.KELP_FARMING;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.board.getOceansOnBoard() >= 6 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);
      player.addProduction(Resources.PLANTS, 3);
      player.plants += 2;
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
