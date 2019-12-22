
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';
import {AndOptions} from '../inputs/AndOptions';

export class Comet implements IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = 'Comet';
    public cardType: CardType = CardType.EVENT;
    public canPlay(): boolean {
      return true;
    }

    private getSelectOceanSpace(player: Player, game: Game): SelectSpace {
      return new SelectSpace(
        'Select space for ocean tile',
        game.getAvailableSpacesForOcean(player),
        (space: ISpace) => {
          game.addOceanTile(player, space.id);
          return undefined;
        }
      )
    }

    public play(player: Player, game: Game) {
      if (game.getPlayers().length === 1) {
        game.increaseTemperature(player, 1);
        
        if (game.noOceansAvailable()) return undefined;
        
        return this.getSelectOceanSpace(player, game);
      }

      var opts: Array<SelectSpace | SelectPlayer> = [];

      // Can we place an ocean?
      if ( ! game.noOceansAvailable()) {
        opts.push(
          this.getSelectOceanSpace(player, game)
        )
      }

      // Can we remove a plants?
      if (player.isAnyOtherPlayerHasPlants(game)) {
        opts.push(
          new SelectPlayer(
            game.getPlayers().filter((p) => p.plants > 0 && p.id != player.id),
            'Select player to remove up to 3 plants from',
            (foundPlayer: Player) => {
              foundPlayer.removePlants(player, 3);
              return undefined;
            }
          )
        )
      }

      // Skip any unnecessary confirmations
      if (opts.length === 0 ) {
        game.increaseTemperature(player, 1);
        return undefined;
      }

      return new AndOptions(
          () => {
            return game.increaseTemperature(player, 1);
          },
          ...opts
      );
    }
}
