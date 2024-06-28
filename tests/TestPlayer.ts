import {Player} from '../src/server/Player';
import {PlayerInput} from '../src/server/PlayerInput';
import {Color} from '../src/common/Color';
import {Tag} from '../src/common/cards/Tag';
import {InputResponse} from '../src/common/inputs/InputResponse';
import {Tags} from '../src/server/player/Tags';
import {IProjectCard} from '../src/server/cards/IProjectCard';
import {PlayerId} from '../src/common/Types';

type Options = {name: string, beginner?: boolean, idSuffix?: string};

class TestPlayerFactory {
  constructor(private color: Color) {}
  newPlayer(opts?: Partial<Options>): TestPlayer {
    return new TestPlayer(this.color, opts);
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

  constructor(color: Color, opts?: Partial<Options>) {
    const name = opts?.name ?? 'player-' + color;

    // If a name is supplied, use it as part of the ID. Otherwise use
    // color in the ID.
    const coreId = opts?.name ?? color;
    const idSuffix = opts?.idSuffix ?? '';
    const id: PlayerId = `p-${coreId}-id${idSuffix}`;

    super(
      name,
      color,
      opts?.beginner ?? false,
      0,
      id);
    this.tags = new TestTags(this);
  }

  public tagsForTest: Partial<Record<Tag, number>> | undefined = undefined;

  public override runInput(input: InputResponse, pi: PlayerInput): void {
    super.runInput(input, pi);
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

  public getPlayableCardsForTest(): Array<IProjectCard> {
    return this.getPlayableCards().map((entry) => entry.card);
  }
}
