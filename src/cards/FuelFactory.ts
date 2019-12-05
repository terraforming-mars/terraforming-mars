
import {IProjectCard} from './IProjectCard';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Tags} from './Tags';

export class FuelFactory implements IProjectCard {
  public cost: number = 6;
  public name: string = 'Fuel Factory';
  public tags: Array<Tags> = [Tags.STEEL];
  public cardType: CardType = CardType.AUTOMATED;
  public canPlay(player: Player): boolean {
    return player.energyProduction >= 1;
  }
  public play(player: Player) {
    player.energyProduction--;
    player.titaniumProduction++;
    player.megaCreditProduction++;
    return undefined;
  }
}
