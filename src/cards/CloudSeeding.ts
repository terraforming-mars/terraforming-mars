
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectPlayer} from '../inputs/SelectPlayer';

export class CloudSeeding implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [];
    public name: string = 'Cloud Seeding';
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return player.megaCreditProduction > -5 &&
        game.getOceansOnBoard() >= 3 - player.getRequirementsBonus(game);
    }
    private doPlay(player: Player): undefined {
      player.megaCreditProduction--;
      player.plantProduction += 2;
      return undefined;
    }
    public play(player: Player, game: Game) {
      if (game.getPlayers().length === 1) return this.doPlay(player);
      return new SelectPlayer(
          game.getPlayers(),
          'Select player to decrease heat production 1 step',
          (foundPlayer: Player) => {
            if (foundPlayer.heatProduction < 1) {
              throw new Error('Player must have heat production');
            }
            foundPlayer.heatProduction--;
            return this.doPlay(player);
          }
      );
    }
}
