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
    [/* game */, player] = testGame(2);
  });

  it('Can not play', function() {
    maxOutOceans(player, 4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});

