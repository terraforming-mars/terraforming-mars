import {Player} from '../src/Player';
import {PlayerInput} from '../src/PlayerInput';
import {Color} from '../src/Color';
import {Units} from '../src/Units';
import {Tags} from '../src/cards/Tags';
import {VictoryPointsBreakdown} from '../src/VictoryPointsBreakdown';

export class TestPlayer extends Player {
  public victoryPointsBreakdown = new VictoryPointsBreakdown();
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

  public getVictoryPoints(): VictoryPointsBreakdown {
    this.victoryPointsBreakdown = super.getVictoryPoints();
    return this.victoryPointsBreakdown;
  }

  public tagsForTest: Partial<TagsForTest> | undefined = undefined;

  public getStandardProjectOption() {
    return super.getStandardProjectOption();
  }

  public getTagCount(tag: Tags, includeEventsTags:boolean = false, includeWildcardTags:boolean = true): number {
    if (this.tagsForTest !== undefined) {
      return this.tagsForTest[tag] || 0;
    }
    return super.getTagCount(tag, includeEventsTags, includeWildcardTags);
  }

  public runInput(input: ReadonlyArray<ReadonlyArray<string>>, pi: PlayerInput): void {
    super.runInput(input, pi);
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
}
