import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {SpaceHotels} from '../../../src/server/cards/prelude/SpaceHotels';
import {testGame} from '../../TestGame';

describe('SpaceHotels', function() {
  let card: SpaceHotels;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SpaceHotels();
    [/* game */, player] = testGame(1);
  });

  it('Can not play', function() {
    player.tagsForTest = {earth: 1};
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', function() {
    player.tagsForTest = {earth: 2};
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.production.megacredits).to.eq(4);
  });
});
