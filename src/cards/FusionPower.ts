
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { Resources } from '../Resources';

export class FusionPower implements IProjectCard {
  public cost: number = 14;
  public tags: Array<Tags> = [Tags.SCIENCE, Tags.ENERGY, Tags.STEEL];
  public cardType: CardType = CardType.AUTOMATED;
  public name: string = 'Fusion Power';
  public hasRequirements = false;
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.ENERGY) >= 2;
  }
  public play(player: Player) {
    player.setProduction(Resources.ENERGY,3);
    return undefined;
  }
}

