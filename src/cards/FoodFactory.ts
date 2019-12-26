
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

export class FoodFactory implements IProjectCard {
  public cost: number = 12;
  public tags: Array<Tags> = [Tags.STEEL];
  public name: string = 'Food Factory';
  public cardType: CardType = CardType.AUTOMATED;
  public canPlay(player: Player): boolean {
    return player.plantProduction >= 1;
  }
  public play(player: Player) {
    player.plantProduction--;
    player.megaCreditProduction += 4;
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
