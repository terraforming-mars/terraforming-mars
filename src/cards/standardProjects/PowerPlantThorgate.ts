import {CardName} from '../../CardName';
import {PowerPlantStandard} from './PowerPlant';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class PowerPlantThorgate extends PowerPlantStandard {
  public name = CardName.STANDARD_POWER_PLANT_THORGATE;
  public _cost = 11 - 3;

  public metadata: CardMetadata = {
    cardNumber: '',
    renderData: CardRenderer.builder((b) =>
      b.effectBox((eb) => {
        eb.megacredits(8).startAction.productionBox((pb) => {
          pb.energy(1);
        });
        eb.description('Action: Spend 8 MC to increase your Energy production 1 step.');
      }),
    ),
  };
}
