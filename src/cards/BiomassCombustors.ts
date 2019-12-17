
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {Player} from '../Player';
import {Game} from '../Game';
import {CardType} from './CardType';
import {SelectPlayer} from '../inputs/SelectPlayer';

export class BiomassCombustors implements IProjectCard {
    public cost: number = 4;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = 'Biomass Combustors';
    public canPlay(player: Player, game: Game): boolean {
      if (game.getPlayers().length > 1) {
        // It's required to reduce someone plants production
        // If it is impossible we can't play this card
        if (game.getPlayers().find((p: Player) => p.plantProduction > 0 ) === undefined) {
          return false;
        }
      }
      return game.getOxygenLevel() >= 6 - player.getRequirementsBonus(game);
    }
    private doPlay(player: Player): undefined {
      player.energyProduction += 2;
      player.victoryPoints--;
      return undefined;
    }
    public play(player: Player, game: Game) {
      if (game.getPlayers().length === 1) return this.doPlay(player);
      return new SelectPlayer(
          game.getPlayers(),
          'Select player to decrease plant production 1 step',
          (otherPlayer: Player) => {
            if (otherPlayer.plantProduction < 1) {
              throw new Error(
                  'No plant production to decrease for selected player'
              );
            }
            otherPlayer.plantProduction--;
            return this.doPlay(player);
          }
      );
    }
}
