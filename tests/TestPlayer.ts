import {Player} from '../src/Player';
import {PlayerInput} from '../src/PlayerInput';
import {Color} from '../src/common/Color';
import {Units} from '../src/common/Units';
import {Tags} from '../src/common/cards/Tags';
import {InputResponse} from '../src/common/inputs/InputResponse';

export class TestPlayer extends Player {
  constructor(color: Color) {
    super('player-' + color, color, false, 0, 'p-' + color + '-id');
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

  public getProductionForTest(): Units {
    return {
      megacredits: this.megaCreditProduction,
      steel: this.steelProduction,
      titanium: this.titaniumProduction,
      plants: this.plantProduction,
      energy: this.energyProduction,
      heat: this.heatProduction,
    };
  }

  public getResourcesForTest(): Units {
    return {
      megacredits: this.megaCredits,
      steel: this.steel,
      titanium: this.titanium,
      plants: this.plants,
      energy: this.energy,
      heat: this.heat,
    };
  }

  // Just makes it public, and therefore callable for testing.
  public override getStandardProjectOption() {
    return super.getStandardProjectOption();
  }

  public tagsForTest: Partial<TagsForTest> | undefined = undefined;

  public override getRawTagCount(tag: Tags, includeEventsTags:boolean = false): number {
    return this.tagsForTest !== undefined ?
      this.tagsForTest[tag] ?? 0 :
      super.getRawTagCount(tag, includeEventsTags);
  }

  public override runInput(input: InputResponse, pi: PlayerInput): void {
    super.runInput(input, pi);
  }

  public purse(): Units {
    return Units.of({
      megacredits: this.megaCredits,
      steel: this.steel,
      titanium: this.titanium,
      plants: this.plants,
      energy: this.energy,
      heat: this.heat,
    });
  }

  public popWaitingFor(): PlayerInput | undefined {
    const waitingFor = this.getWaitingFor();
    this.waitingFor = undefined;
    this.waitingForCb = undefined;
    return waitingFor;
  }
}

export interface TagsForTest {
  building: number;
  space: number;
  science: number;
  power: number;
  earth: number;
  jovian: number;
  venus: number;
  plant: number;
  microbe: number;
  animal: number;
  city: number;
  wild: number;
  moon: number;
  event: number;
  mars: number;
  clone: number;
}
