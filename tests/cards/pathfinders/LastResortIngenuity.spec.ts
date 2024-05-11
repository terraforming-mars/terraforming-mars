import {expect} from 'chai';
import {LastResortIngenuity} from '../../../src/server/cards/pathfinders/LastResortIngenuity';
import {AsteroidMiningConsortium} from '../../../src/server/cards/base/AsteroidMiningConsortium';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('LastResortIngenuity', function() {
  let card: LastResortIngenuity;
  let player: TestPlayer;

  beforeEach(function() {
    card = new LastResortIngenuity();
    [/* game */, player] = testGame(1);
  });

  it('play', function() {
    const cardWithoutTags = new AsteroidMiningConsortium();
    player.titanium = 10;
    // AsteroidMiningConsortium doesn't have a space tag, but requires titanium production.
    player.production.override({titanium: 1});

    expect(player.canPlay(cardWithoutTags)).is.false;

    player.playCard(card);

    expect(player.canPlay(cardWithoutTags)).is.true;
  });
});
