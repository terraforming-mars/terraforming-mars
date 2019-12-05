
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

export class FueledGenerators implements IProjectCard {
  public cost: number = 1;
  public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
  public cardType: CardType = CardType.AUTOMATED;
  public name: string = 'Fueled Generators';
  public canPlay(player: Player): boolean {
    return player.megaCreditProduction >= -4;
  }
  public play(player: Player) {
    player.megaCreditProduction--;
    player.energyProduction++;
    return undefined;
  }
}
