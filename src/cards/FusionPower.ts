
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class FusionPower implements IProjectCard {
  public cost = 14;
  public tags = [Tags.SCIENCE, Tags.ENERGY, Tags.STEEL];
  public cardType = CardType.AUTOMATED;
  public name = CardName.FUSION_POWER;
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.ENERGY) >= 2;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 3);
    return undefined;
  }
}

