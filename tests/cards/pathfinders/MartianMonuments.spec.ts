import {expect} from 'chai';
import {MartianMonuments} from '../../../src/server/cards/pathfinders/MartianMonuments';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {addCity} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {SpaceName} from '../../../src/server/SpaceName';

describe('MartianMonuments', function() {
  let card: MartianMonuments;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new MartianMonuments();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
  });

  it('can play', function() {
    expect(player.canPlayIgnoringCost(card)).is.false;
    addCity(player);
    expect(player.canPlayIgnoringCost(card)).is.true;

    expect(player2.canPlayIgnoringCost(card)).is.false;

    // Add a city in space, it shouldn't count.
    player.game.addCityTile(player2, SpaceName.GANYMEDE_COLONY, SpaceType.COLONY);
    expect(player2.canPlayIgnoringCost(card)).is.false;
  });

  it('play', function() {
    player.tagsForTest = {mars: 8};
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 9})); // "including this"
  });
});
