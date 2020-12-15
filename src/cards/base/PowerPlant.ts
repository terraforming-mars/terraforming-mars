import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class PowerPlant implements IProjectCard {
    public cost = 4;
    public tags = [Tags.ENERGY, Tags.STEEL];
    public name = CardName.POWER_PLANT;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '141',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.energy(1));
      }),
      description: 'Increase your Energy production 1 step.',
    }
}

