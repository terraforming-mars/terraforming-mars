import {expect} from 'chai';
import {MartianMonuments} from '../../../src/server/cards/pathfinders/MartianMonuments';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {addCity} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
import {SpaceName} from '../../../src/common/boards/SpaceName';

describe('MartianMonuments', () => {
  let card: MartianMonuments;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    card = new MartianMonuments();
    [/* game */, player, player2] = testGame(2);
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.false;
    addCity(player);
    expect(card.canPlay(player)).is.true;

    expect(card.canPlay(player2)).is.false;

    // Add a city in space, it shouldn't count.
    addCity(player2, SpaceName.GANYMEDE_COLONY);
    expect(card.canPlay(player2)).is.false;
  });

  it('play', () => {
    player.tagsForTest = {mars: 8};
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 9})); // "including this"
  });
});
