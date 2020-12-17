import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Mohole extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL];
    public name = CardName.MOHOLE;
    public play(player: Player) {
      player.addProduction(Resources.HEAT, 3);
      player.heat += 3;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P22',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.heat(3)).br;
        b.heat(3);
      }),
      description: 'Increase your heat production 3 steps. Gain 3 heat.',
    }
}
