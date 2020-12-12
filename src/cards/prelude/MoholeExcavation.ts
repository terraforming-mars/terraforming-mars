import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MoholeExcavation extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL];
    public name = CardName.MOHOLE_EXCAVATION;
    public play(player: Player) {
      player.addProduction(Resources.STEEL);
      player.addProduction(Resources.HEAT, 2);
      player.heat += 2;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P23',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.steel(1).br;
          pb.heat(2);
        }).heat(2);
      }),
      description: 'Increase your steel production 1 step and heat production 2 steps. Gain 2 heat.',
    }
}
