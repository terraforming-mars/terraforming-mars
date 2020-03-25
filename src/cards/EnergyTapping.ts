
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectPlayer} from '../inputs/SelectPlayer';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class EnergyTapping implements IProjectCard {
  public cost: number = 3;
  public tags: Array<Tags> = [Tags.ENERGY];
  public name: CardName = CardName.ENERGY_TAPPING;
  public cardType: CardType = CardType.AUTOMATED;
  public hasRequirements = false;
  public canPlay(_player: Player, game: Game): boolean {
    if (game.getPlayers().length === 1) return true;
    return game.getPlayers().filter((p) => p.getProduction(Resources.ENERGY) > 0).length > 0;
  }
  private doPlay(player: Player) {
    player.setProduction(Resources.ENERGY);
    return undefined;
  }
  public play(player: Player, game: Game) {
    if (game.getPlayers().length == 1) {
      return this.doPlay(player);
    }
    const playersToReduceEnergy = game.getPlayers().filter((p) => p.getProduction(Resources.ENERGY) > 0);

    if (playersToReduceEnergy.length === 1) {
      playersToReduceEnergy[0].setProduction(Resources.ENERGY,-1,game,player);
      return this.doPlay(player);
    }

    return new SelectPlayer(
        playersToReduceEnergy,
        'Select player to decrease energy production 1 step',
        (foundPlayer: Player) => {
          if (foundPlayer.getProduction(Resources.ENERGY) < 1) {
            throw new Error('Selected player has no energy production');
          }
          foundPlayer.setProduction(Resources.ENERGY,-1,game,player);
          return this.doPlay(player);
        }
    );
  }
  public getVictoryPoints() {
    return -1;
  }
}
