import {expect} from 'chai';
import {RichDeposits} from '../../../src/cards/pathfinders/RichDeposits';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('RichDeposits', function() {
  let card: RichDeposits;
  let player: TestPlayer;

  beforeEach(function() {
    card = new RichDeposits();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });
  it('canPlay', function() {
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;
    player.tagsForTest = {science: 1};
    expect(player.canPlay(card)).is.false;
    player.tagsForTest = {science: 2};
    expect(player.canPlay(card)).is.true;
  });

  it('play', function() {
    expect(player.getProductionForTest().steel).eq(0);
    card.play(player);
    expect(player.getProductionForTest().steel).eq(3);
  });
});
