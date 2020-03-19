
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectPlayer} from '../inputs/SelectPlayer';
import { Resources } from "../Resources";
import { CardName } from '../CardName';

export class CloudSeeding implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.CLOUD_SEEDING;
    public cardType: CardType = CardType.AUTOMATED;
    
    private playersWithHeatProduction(game: Game): Array<Player> {
      return game.getPlayers().filter((player) => player.getProduction(Resources.HEAT) >= 1);
    }

    public canPlay(player: Player, game: Game): boolean {
      if (this.playersWithHeatProduction(game).length === 0) return false;
      return player.getProduction(Resources.MEGACREDITS) > -5 &&
        game.board.getOceansOnBoard() >= 3 - player.getRequirementsBonus(game);
    }
    private doPlay(player: Player): undefined {
      player.setProduction(Resources.MEGACREDITS,-1);
      player.setProduction(Resources.PLANTS,2);
      return undefined;
    }
    public play(player: Player, game: Game) {
      if (game.getPlayers().length === 1) return this.doPlay(player);
      return new SelectPlayer(
          this.playersWithHeatProduction(game),
          'Select player to decrease heat production 1 step',
          (foundPlayer: Player) => {
            foundPlayer.setProduction(Resources.HEAT,-1,game,player);
            return this.doPlay(player);
          }
      );
    }
}
