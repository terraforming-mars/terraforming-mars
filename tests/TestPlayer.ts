import {Player} from '../src/Player';
import {PlayerInput} from '../src/PlayerInput';
import {Color} from '../src/Color';
import {Units} from '../src/Units';
import {Tags} from '../src/cards/Tags';
import {VictoryPointsBreakdown} from '../src/VictoryPointsBreakdown';

export class TestPlayer extends Player {
  public victoryPointsBreakdown = new VictoryPointsBreakdown();
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

  public getVictoryPoints(): VictoryPointsBreakdown {
    this.victoryPointsBreakdown = super.getVictoryPoints();
    return this.victoryPointsBreakdown;
  }

  public getStandardProjectOption() {
    return super.getStandardProjectOption();
  }

  public tagsForTest: Partial<TagsForTest> | undefined = undefined;

  public getTagCount(tag: Tags, includeEventsTags:boolean = false, includeWildcardTags:boolean = true): number {
    if (this.tagsForTest !== undefined) {
      return this.tagsForTest[tag] || 0;
    }
    return super.getTagCount(tag, includeEventsTags, includeWildcardTags);
  }

  public runInput(input: ReadonlyArray<ReadonlyArray<string>>, pi: PlayerInput): void {
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
