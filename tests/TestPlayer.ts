import {Player} from '../src/Player';
import {PlayerInput} from '../src/PlayerInput';
import {Color} from '../src/common/Color';
import {Units} from '../src/common/Units';
import {Tags} from '../src/common/cards/Tags';
import {InputResponse} from '../src/common/inputs/InputResponse';
import {ICorporationCard} from '@/cards/corporation/ICorporationCard';

class TestPlayerFactory {
  constructor(private color: Color) {}
  newPlayer(beginner: boolean = false, idSuffix = ''): TestPlayer {
    return new TestPlayer(this.color, beginner, idSuffix);
  }
}

export class TestPlayer extends Player {
  // Prefer these players when testing, as their IDs are easy to recognize in output. Plus TestPlayer instances have useful support methods.
  public static BLUE: TestPlayerFactory = new TestPlayerFactory(Color.BLUE);
  public static RED: TestPlayerFactory = new TestPlayerFactory(Color.RED);
  public static YELLOW: TestPlayerFactory = new TestPlayerFactory(Color.YELLOW);
  public static GREEN: TestPlayerFactory = new TestPlayerFactory(Color.GREEN);
  public static BLACK: TestPlayerFactory = new TestPlayerFactory(Color.BLACK);
  public static PURPLE: TestPlayerFactory = new TestPlayerFactory(Color.PURPLE);
  public static ORANGE: TestPlayerFactory = new TestPlayerFactory(Color.ORANGE);
  public static PINK: TestPlayerFactory = new TestPlayerFactory(Color.PINK);

  constructor(color: Color, beginner: boolean = false, idSuffix = '') {
    super('player-' + color, color, beginner, 0, `p-${color}-id${idSuffix}`);
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

  public setCorporationForTest(card: ICorporationCard | undefined) {
    if (card === undefined) {
      this.corporations = [];
    } else {
      this.corporations = [card];
    }
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
