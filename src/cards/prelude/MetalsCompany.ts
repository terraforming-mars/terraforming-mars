import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MetalsCompany extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.METALS_COMPANY;
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS);
      player.addProduction(Resources.TITANIUM);
      player.addProduction(Resources.STEEL);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P20',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(1).steel(1).titanium(1));
      }),
      description: 'Increase your MC, steel and titanium production 1 step.',
    }
}
