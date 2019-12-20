
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectPlayer} from '../inputs/SelectPlayer';

export class EnergyTapping implements IProjectCard {
  public cost: number = 3;
  public tags: Array<Tags> = [Tags.ENERGY];
  public name: string = 'Energy Tapping';
  public cardType: CardType = CardType.AUTOMATED;
  
  public canPlay(_player: Player, game: Game): boolean {
    if (game.getPlayers().length === 1) return true;
    return game.getPlayers().filter((p) => p.energyProduction > 0).length > 0;
  }
  private doPlay(player: Player) {
    player.energyProduction++;
    player.victoryPoints--;
    return undefined;
  }
  public play(player: Player, game: Game) {
    if (game.getPlayers().length == 1) {
      return this.doPlay(player);
    }
    const playersToReduceEnergy = game.getPlayers().filter((p) => p.energyProduction > 0);

    if (playersToReduceEnergy.length === 1) {
      playersToReduceEnergy[0].energyProduction--;
      return this.doPlay(player);
    }

    return new SelectPlayer(
        playersToReduceEnergy,
        'Select player to decrease energy production 1 step',
        (foundPlayer: Player) => {
          if (foundPlayer.energyProduction < 1) {
            throw new Error('Selected player has no energy production');
          }
          foundPlayer.energyProduction--;
          return this.doPlay(player);
        }
    );
  }
}
