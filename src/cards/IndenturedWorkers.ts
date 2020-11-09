
import {CardType} from './CardType';
import {Player} from '../Player';
import {IProjectCard} from './IProjectCard';
import {Game} from '../Game';
import {CardName} from '../CardName';

export class IndenturedWorkers implements IProjectCard {
    public cardType = CardType.EVENT;
    public cost = 0;
    public tags = [];
    public name = CardName.INDENTURED_WORKERS;

    public getCardDiscount(player: Player, _game: Game) {
      if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
        return 8;
      }
      return 0;
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return -1;
    }
}
