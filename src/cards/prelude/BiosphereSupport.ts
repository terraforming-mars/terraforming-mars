import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class BiosphereSupport extends PreludeCard implements IProjectCard {
    public tags = [Tags.PLANT];
    public name = CardName.BIOSPHERE_SUPPORT;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.MEGACREDITS) >= -4;
    }
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, -1);
      player.addProduction(Resources.PLANTS, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P05',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().megacredits(1).br;
          pb.plants(2);
        });
      }),
      description: 'Increase your plant production 2 steps. Decrease your MC production 1 step.',
    }
}

