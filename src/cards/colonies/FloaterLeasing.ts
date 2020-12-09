import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class FloaterLeasing implements IProjectCard {
    public cost = 3;
    public tags = [];
    public name = CardName.FLOATER_LEASING;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, Math.floor(player.getResourceCount(ResourceType.FLOATER) / 3));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C10',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(1)).slash().floaters(3).digit;
      }),
      description: 'Increase your MC production 1 step PER 3 floaters you have.',
    }
}

