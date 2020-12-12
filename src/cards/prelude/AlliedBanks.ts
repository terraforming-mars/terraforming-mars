import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class AlliedBanks extends PreludeCard implements IProjectCard {
    public tags = [Tags.EARTH];
    public name = CardName.ALLIED_BANKS;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 4);
      player.megaCredits += 3;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P01',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(4)).br;
        b.megacredits(3);
      }),
      description: 'Increase your MC production 4 steps. Gain 3 MC.',
    }
}

