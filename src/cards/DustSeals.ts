
import {IProjectCard} from './IProjectCard';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { CardName } from '../CardName';

export class DustSeals implements IProjectCard {
    public cost = 2;
    public tags = [];
    public cardType = CardType.AUTOMATED;
    public name = CardName.DUST_SEALS;
    public canPlay(player: Player, game: Game): boolean {
      return game.board.getOceansOnBoard() <= 3 + player.getRequirementsBonus(game);
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
