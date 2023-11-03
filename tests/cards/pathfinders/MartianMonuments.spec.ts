import {expect} from 'chai';
import {MartianMonuments} from '../../../src/server/cards/pathfinders/MartianMonuments';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {addCity} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
import {SpaceName} from '../../../src/server/SpaceName';

describe('MartianMonuments', function() {
  let card: MartianMonuments;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new MartianMonuments();
    [/* game */, player, player2] = testGame(2);
  });

  it('can play', function() {
    expect(player.simpleCanPlay(card)).is.false;
    addCity(player);
    expect(player.simpleCanPlay(card)).is.true;

    expect(player2.simpleCanPlay(card)).is.false;

    // Add a city in space, it shouldn't count.
    addCity(player2, SpaceName.GANYMEDE_COLONY);
    expect(player2.simpleCanPlay(card)).is.false;
  });

  it('play', function() {
    player.tagsForTest = {mars: 8};
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 9})); // "including this"
  });
});
