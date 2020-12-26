import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class GHGFactories implements IProjectCard {
  public cost = 11;
  public tags = [Tags.BUILDING];
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
  public metadata: CardMetadata = {
    cardNumber: '126',
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => {
        pb.minus().energy(1).br;
        pb.plus().heat(4).digit;
      });
    }),
    description: 'Decrease your Energy production 1 step and increase your heat production 4 steps.',
  };
}
