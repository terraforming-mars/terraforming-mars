import {Player} from '../src/server/Player';
import {PlayerInput} from '../src/server/PlayerInput';
import {Color} from '../src/common/Color';
import {Units} from '../src/common/Units';
import {Tag} from '../src/common/cards/Tag';
import {InputResponse} from '../src/common/inputs/InputResponse';
import {ICorporationCard} from '../src/server/cards/corporation/ICorporationCard';
import {Tags} from '../src/server/player/Tags';
import {SelectInitialCards} from '../src/server/inputs/SelectInitialCards';

class TestPlayerFactory {
  constructor(private color: Color) {}
  newPlayer(beginner: boolean = false, idSuffix = ''): TestPlayer {
    return new TestPlayer(this.color, beginner, idSuffix);
  }
}

class TestTags extends Tags {
  private testPlayer: TestPlayer;
  constructor(player: TestPlayer) {
    super(player);
    this.testPlayer = player;
  }

  public override rawCount(tag: Tag, includeEventsTags:boolean = false): number {
    return this.testPlayer.tagsForTest !== undefined ?
      this.testPlayer.tagsForTest[tag] ?? 0 :
      super.rawCount(tag, includeEventsTags);
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
    this.tags = new TestTags(this);
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

  public popWaitingFor2(): [PlayerInput | undefined, (() => void) | undefined] {
    const waitingFor = this.waitingFor;
    const waitingForCb = this.waitingForCb;
    this.waitingFor = undefined;
    this.waitingForCb = undefined;
    return [waitingFor, waitingForCb];
  }

  public popWaitingFor(): PlayerInput | undefined {
    const waitingFor = this.getWaitingFor();
    this.waitingFor = undefined;
    this.waitingForCb = undefined;
    return waitingFor;
  }

  /* Removes waitingFor if it is SelectInitialCards. Used when wanting it cleared out for further testing. */
  public popSelectInitialCards(): PlayerInput | undefined {
    if (this.getWaitingFor() instanceof SelectInitialCards) {
      return this.popWaitingFor();
    }
    return undefined;
  }

  public setCorporationForTest(card: ICorporationCard | undefined) {
    if (card === undefined) {
      this.corporations = [];
    } else {
      this.corporations = [card];
    }
  }
}

export type TagsForTest = {
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
