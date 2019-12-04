
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';

export class DustSeals implements IProjectCard {
    public cost: number = 2;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = 'Dust Seals';
    public canPlay(player: Player, game: Game): boolean {
      return game.getOceansOnBoard() <= 3 + player.getRequirementsBonus(game);
    }
    public play(player: Player) {
      player.victoryPoints++;
      return undefined;
    }
}
