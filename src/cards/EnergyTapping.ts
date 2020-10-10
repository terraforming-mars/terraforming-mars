
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class EnergyTapping implements IProjectCard {
  public cost: number = 3;
  public tags: Array<Tags> = [Tags.ENERGY];
  public name: CardName = CardName.ENERGY_TAPPING;
  public cardType: CardType = CardType.AUTOMATED;
  public hasRequirements = false;
  public canPlay(_player: Player, game: Game): boolean {
    return game.someoneHasResourceProduction(Resources.ENERGY,1)
  }

  public play(player: Player, game: Game) {
    game.addResourceProductionDecreaseInterrupt(player, Resources.ENERGY, 1);
    player.addProduction(Resources.ENERGY);
    return undefined;
  }

  public getVictoryPoints() {
    return -1;
  }
}
