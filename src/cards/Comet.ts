
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


    private getSelectOceanSpace(player: Player, game: Game, placeBonusOcean :SelectSpace | undefined): SelectSpace {
      return new SelectSpace(
        'Select space for ocean tile',
        game.board.getAvailableSpacesForOcean(player),
        (space: ISpace) => {
          game.addOceanTile(player, space.id);
          if (placeBonusOcean === undefined || game.noOceansAvailable()) return undefined;
          return placeBonusOcean;
        }
      )
    }

    public play(player: Player, game: Game) {
      var placeBonusOcean: SelectSpace | undefined;

      if (game.getPlayers().length === 1) {
        placeBonusOcean = game.increaseTemperature(player, 1);
        
        if (game.noOceansAvailable()) return undefined;
        
        return this.getSelectOceanSpace(player, game, placeBonusOcean);
      }

      var opts: Array<SelectSpace | SelectPlayer> = [];

      // Can we place an ocean?
      if ( ! game.noOceansAvailable()) {
        opts.push(
          this.getSelectOceanSpace(player, game, undefined)
        )
      }

      const playersToRemovePlantsFrom = player.getOtherPlayersWithPlantsToRemove(game);
      // Can we remove a plants?
      if (playersToRemovePlantsFrom.length > 0) {
        if (playersToRemovePlantsFrom.length === 1) {
          playersToRemovePlantsFrom[0].removePlants(player, 3, game);
        } else {
          opts.push(
            new SelectPlayer(
              playersToRemovePlantsFrom,
              'Select player to remove up to 3 plants from',
              (foundPlayer: Player) => {
                foundPlayer.removePlants(player, 3, game);
                return undefined;
              }
            )
          )
        }
      }

      // Skip any unnecessary confirmations
      if (opts.length === 0 ) {
        return game.increaseTemperature(player, 1);
      }

      return new AndOptions(
          () => {
            return game.increaseTemperature(player, 1);
          },
          ...opts
      );
    }
}
