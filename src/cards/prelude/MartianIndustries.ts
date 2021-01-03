import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MartianIndustries extends PreludeCard implements IProjectCard {
    public tags = [Tags.BUILDING];
    public name = CardName.MARTIAN_INDUSTRIES;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY);
      player.addProduction(Resources.STEEL);
      player.megaCredits += 6;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P18',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.energy(1).steel(1)).br;
        b.megacredits(6);
      }),
      description: 'Increase your energy and steel production 1 step. Gain 6 MC.',
    }
}

