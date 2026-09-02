import {expect} from 'chai';
import {RichDeposits} from '../../../src/server/cards/pathfinders/RichDeposits';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('RichDeposits', () => {
  let card: RichDeposits;
  let player: TestPlayer;

  beforeEach(() => {
    card = new RichDeposits();
    [/* game */, player] = testGame(1);
  });
  it('canPlay', () => {
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;
    player.tagsForTest = {science: 1};
    expect(player.canPlay(card)).is.false;
    player.tagsForTest = {science: 2};
    expect(player.canPlay(card)).is.true;
  });

  it('play', () => {
    expect(player.production.asUnits().steel).eq(0);
    card.play(player);
    expect(player.production.asUnits().steel).eq(3);
  });
});
