import {expect} from 'chai';
import {DustSeals} from '../../../src/server/cards/base/DustSeals';
import {TestPlayer} from '../../TestPlayer';
import {maxOutOceans} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('DustSeals', function() {
  let card: DustSeals;
  let player: TestPlayer;

  beforeEach(function() {
    card = new DustSeals();
    [/* skipped */, player] = testGame(2);
  });

  it('Can not play', function() {
    maxOutOceans(player, 4);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});

