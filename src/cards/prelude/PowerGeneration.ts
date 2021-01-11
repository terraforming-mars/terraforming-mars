import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class PowerGeneration extends PreludeCard implements IProjectCard {
    public tags = [Tags.ENERGY];
    public name = CardName.POWER_GENERATION;
    public play(player: Player) {
      player.addProduction(Resources.ENERGY, 3);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P27',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.energy(3));
      }),
      description: 'Increase your energy production 3 steps.',
    }
}
