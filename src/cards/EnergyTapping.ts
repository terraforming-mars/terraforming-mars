
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
  public text: string = 'Decrease any energy production 1 step and increase' +
    ' your own 1 step. Lose 1 victory point.';
  public requirements: undefined;
  public description: string = 'They need it. But we need it more.';
  public canPlay(): boolean {
    return true;
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
    return new SelectPlayer(
        game.getPlayers(),
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
