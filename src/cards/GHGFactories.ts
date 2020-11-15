import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {Player} from '../Player';
import {CardType} from './CardType';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class GHGFactories implements IProjectCard {
  public cost = 11;
  public tags = [Tags.STEEL];
  public cardType = CardType.AUTOMATED;
  public name = CardName.GHG_FACTORIES;
  public hasRequirements = false;
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.HEAT, 4);
    return undefined;
  }
}
