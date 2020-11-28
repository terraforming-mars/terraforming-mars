
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class GreatDam implements IProjectCard {
    public cost = 12;
    public tags = [Tags.ENERGY, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.GREAT_DAM;
    public canPlay(player: Player, game: Game): boolean {
      return game.board.getOceansOnBoard() >= 4 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
      player.addProduction(Resources.ENERGY, 2);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}

