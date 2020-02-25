import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectPlayer} from '../inputs/SelectPlayer';
import { Resources } from '../Resources';

export class AsteroidMiningConsortium implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = 'Asteroid Mining Consortium';
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.TITANIUM) >= 1;
    }
    public play(player: Player, game: Game) {
      if (game.getPlayers().length == 1) {
        player.setProduction(Resources.TITANIUM);
        return undefined;
      }
      const targetPlayers = game.getPlayers().filter(p => p.getProduction(Resources.TITANIUM) > 0);

      if (targetPlayers.length === 0) return undefined;

      if (targetPlayers.length === 1) {
        targetPlayers[0].setProduction(Resources.TITANIUM,-1, game, player);
        player.setProduction(Resources.TITANIUM);
        return undefined;
      }

      return new SelectPlayer(
          targetPlayers,
          'Select player to decrease titanium production',
          (foundPlayer: Player) => {
            foundPlayer.setProduction(Resources.TITANIUM,-1, game, player);
            player.setProduction(Resources.TITANIUM);
            return undefined;
          }
      );
    }
    public getVictoryPoints() {
      return 1;
    }
}
