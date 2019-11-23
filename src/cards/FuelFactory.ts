
import {IProjectCard} from './IProjectCard';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Tags} from './Tags';

export class FuelFactory implements IProjectCard {
  public cost: number = 6;
  public name: string = 'Fuel Factory';
  public tags: Array<Tags> = [Tags.STEEL];
  public cardType: CardType = CardType.AUTOMATED;
  public text: string = 'Decrease your energy production 1 step and increase' +
    ' your titanium and your mega credit production 1 step each.';
  public requirements: undefined;
  public description: string = 'With its shallow gravity well, Mars is a ' +
    'good host for the space industry, and rockets need fuel.';
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
