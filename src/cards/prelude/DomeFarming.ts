import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class DomeFarming extends PreludeCard implements IProjectCard {
    public tags = [Tags.PLANT, Tags.STEEL];
    public name = CardName.DOME_FARMING;
    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P07',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(2).plants(1));
      }),
      description: 'Increase your MC production 2 steps and plant production 1 step.',
    }
}

