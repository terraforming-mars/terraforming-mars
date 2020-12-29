import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class FueledGenerators implements IProjectCard {
  public cost = 1;
  public tags = [Tags.ENERGY, Tags.BUILDING];
  public cardType = CardType.AUTOMATED;
  public name = CardName.FUELED_GENERATORS;
  public hasRequirements = false;
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -4;
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -1);
    player.addProduction(Resources.ENERGY);
    return undefined;
  }
  public metadata: CardMetadata = {
    cardNumber: '100',
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => {
        pb.minus().megacredits(1).br;
        pb.plus().energy(1);
      });
    }),
    description: 'Decrease your MC production 1 step and increase your Energy production 1 steps.',
  }
}
