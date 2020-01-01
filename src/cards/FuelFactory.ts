
import {IProjectCard} from './IProjectCard';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Tags} from './Tags';
import { Resources } from '../Resources';

export class FuelFactory implements IProjectCard {
  public cost: number = 6;
  public name: string = 'Fuel Factory';
  public tags: Array<Tags> = [Tags.STEEL];
  public cardType: CardType = CardType.AUTOMATED;
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.setProduction(Resources.ENERGY,-1);
    player.setProduction(Resources.TITANIUM);
    player.setProduction(Resources.MEGACREDITS);
    return undefined;
  }
}
