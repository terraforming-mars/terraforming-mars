
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectPlayer} from '../inputs/SelectPlayer';

export class DeimosDown implements IProjectCard {
    public cost: number = 31;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = 'Deimos Down';
    public cardType: CardType = CardType.EVENT;
    public canPlay(): boolean {
      return true;
    }
    private doPlay(player: Player, game: Game) {
      player.steel += 4;
      return game.increaseTemperature(player, 3);
    }
    public play(player: Player, game: Game) {
      if (game.getPlayers().length == 1) {
        return this.doPlay(player, game);
      }

      const playersToRemovePlantsFrom = game.getPlayers().filter(
        (p) => p.id != player.id && p.plants > 0 && ! player.hasProtectedHabitats()
      )

      if ( playersToRemovePlantsFrom.length === 0) {
        return this.doPlay(player, game);
      }

      // Just one target player, we remove plants from him without asking
      if (playersToRemovePlantsFrom.length === 1) {
        playersToRemovePlantsFrom[0].removePlants(player, 8);
        return this.doPlay(player, game);
      }

      // Player have to choose target
      return new SelectPlayer(
        playersToRemovePlantsFrom,
          'Select player to remove up to 8 plants from',
          (foundPlayer: Player) => {
            foundPlayer.removePlants(player, 8);
            return this.doPlay(player, game);
          }
      );
    }
}
