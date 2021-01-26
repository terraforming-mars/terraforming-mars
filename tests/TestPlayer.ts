import {Player} from '../src/Player';
import {Color} from '../src/Color';
import {Units} from '../src/Units';

export class TestPlayer extends Player {
  constructor(color: Color) {
    super('player-' + color, color, false, 0, color + '-id');
  }

  public setProductionForTest(units: Partial<Units>) {
    if (units.megacredits !== undefined) {
      this.megaCreditProduction = units.megacredits;
    }
    if (units.steel !== undefined) {
      this.steelProduction = units.steel;
    }
    if (units.titanium !== undefined) {
      this.titaniumProduction = units.titanium;
    }
    if (units.plants !== undefined) {
      this.plantProduction = units.plants;
    }
    if (units.energy !== undefined) {
      this.energyProduction = units.energy;
    }
    if (units.heat !== undefined) {
      this.heatProduction = units.heat;
    }
  }
}
