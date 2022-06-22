import {Color} from '../src/common/Color';
import {TestPlayer} from './TestPlayer';

class TestPlayerFactory {
  constructor(private color: Color) {}
  newPlayer(): TestPlayer {
    return new TestPlayer(this.color);
  }
}

// Prefer these players when testing, as their IDs are easy to recognize in output.
export class TestPlayers {
  public static BLUE: TestPlayerFactory = new TestPlayerFactory(Color.BLUE);
  public static RED: TestPlayerFactory = new TestPlayerFactory(Color.RED);
  public static YELLOW: TestPlayerFactory = new TestPlayerFactory(Color.YELLOW);
  public static GREEN: TestPlayerFactory = new TestPlayerFactory(Color.GREEN);
  public static BLACK: TestPlayerFactory = new TestPlayerFactory(Color.BLACK);
  public static PURPLE: TestPlayerFactory = new TestPlayerFactory(Color.PURPLE);
  public static ORANGE: TestPlayerFactory = new TestPlayerFactory(Color.ORANGE);
  public static PINK: TestPlayerFactory = new TestPlayerFactory(Color.PINK);
}
