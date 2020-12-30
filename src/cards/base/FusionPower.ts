import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class FusionPower implements IProjectCard {
  public cost = 14;
  public tags = [Tags.SCIENCE, Tags.ENERGY, Tags.BUILDING];
  public cardType = CardType.AUTOMATED;
  public name = CardName.FUSION_POWER;
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.ENERGY) >= 2;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 3);
    return undefined;
  }
  public metadata: CardMetadata = {
    cardNumber: '132',
    requirements: CardRequirements.builder((b) => b.tag(Tags.ENERGY, 2)),
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => pb.energy(3));
    }),
    description: 'Requires 2 Power tags. Increase your Energy production 3 steps.',
  }
}

