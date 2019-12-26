import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectPlayer} from '../inputs/SelectPlayer';

export class Asteroid implements IProjectCard {
    public cost: number = 14;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = 'Asteroid';
    public cardType: CardType = CardType.EVENT;
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player, game: Game) {
      const playersToRemovePlantsFrom = player.getOtherPlayersWithPlantsToRemove(game);

      if (game.getPlayers().length === 1 || playersToRemovePlantsFrom.length === 0) {
        player.titanium += 2;
        return game.increaseTemperature(player, 1);
      }

      return new SelectPlayer(
        playersToRemovePlantsFrom,
        'Select player to remove up to 3 plants from',
        (foundPlayer: Player) => {
          foundPlayer.removePlants(player, 3);
          player.titanium += 2;
          return game.increaseTemperature(player, 1);
        }
      );
    }
}
